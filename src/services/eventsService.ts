import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { getFirestoreDb } from './firebase';
import { PampulhaEvent, EventFilterOptions } from '../types/event';
import { INITIAL_MOCK_EVENTS } from './mockData';

const LOCAL_STORAGE_KEY = 'pampulha_events';

export const sortEventsChronologically = (events: PampulhaEvent[]): PampulhaEvent[] => {
  return [...events].sort((a, b) => {
    const dateTimeA = `${a.date}T${a.time}`;
    const dateTimeB = `${b.date}T${b.time}`;
    return dateTimeA.localeCompare(dateTimeB);
  });
};

const getLocalEvents = (): PampulhaEvent[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_EVENTS));
      return INITIAL_MOCK_EVENTS;
    }
    const parsed = JSON.parse(raw) as PampulhaEvent[];
    return Array.isArray(parsed) ? parsed : INITIAL_MOCK_EVENTS;
  } catch {
    return INITIAL_MOCK_EVENTS;
  }
};

const setLocalEvents = (events: PampulhaEvent[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
};

export const resetEventsToDefault = (): void => {
  setLocalEvents(INITIAL_MOCK_EVENTS);
};

export const getEvents = async (): Promise<PampulhaEvent[]> => {
  const db = getFirestoreDb();

  if (db) {
    try {
      const q = query(collection(db, 'events'), orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      const events: PampulhaEvent[] = [];
      snapshot.forEach((d) => {
        events.push({ id: d.id, ...d.data() } as PampulhaEvent);
      });
      return sortEventsChronologically(events);
    } catch (err) {
      console.warn('Erro ao consultar Firestore, usando armazenamento local:', err);
    }
  }

  return sortEventsChronologically(getLocalEvents());
};

export const getEventById = async (id: string): Promise<PampulhaEvent | null> => {
  const db = getFirestoreDb();

  if (db) {
    try {
      const ref = doc(db, 'events', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as PampulhaEvent;
      }
      return null;
    } catch (err) {
      console.warn('Erro ao buscar evento no Firestore:', err);
    }
  }

  const events = getLocalEvents();
  return events.find((e) => e.id === id) || null;
};

export const saveEvent = async (
  eventData: Partial<PampulhaEvent> & Omit<PampulhaEvent, 'id' | 'createdAt' | 'updatedAt'>
): Promise<PampulhaEvent> => {
  const now = new Date().toISOString();
  const db = getFirestoreDb();

  const id = eventData.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const fullEvent: PampulhaEvent = {
    ...eventData,
    id,
    createdAt: eventData.createdAt || now,
    updatedAt: now,
  };

  if (db) {
    try {
      const ref = doc(db, 'events', id);
      await setDoc(ref, fullEvent);
      return fullEvent;
    } catch (err) {
      console.warn('Erro ao salvar no Firestore, salvando localmente:', err);
    }
  }

  const events = getLocalEvents();
  const index = events.findIndex((e) => e.id === id);

  if (index >= 0) {
    events[index] = fullEvent;
  } else {
    events.push(fullEvent);
  }

  setLocalEvents(events);
  return fullEvent;
};

export const deleteEvent = async (id: string): Promise<void> => {
  const db = getFirestoreDb();

  if (db) {
    try {
      const ref = doc(db, 'events', id);
      await deleteDoc(ref);
      return;
    } catch (err) {
      console.warn('Erro ao deletar no Firestore, deletando localmente:', err);
    }
  }

  const events = getLocalEvents();
  const filtered = events.filter((e) => e.id !== id);
  setLocalEvents(filtered);
};

export const filterEvents = (
  events: PampulhaEvent[],
  options: EventFilterOptions,
  currentDateIso: string = new Date().toISOString().split('T')[0]!
): PampulhaEvent[] => {
  return events.filter((event) => {
    // Filtro por tipo
    if (options.type !== 'todos' && event.type !== options.type) {
      return false;
    }

    // Filtro por eventos futuros
    if (options.onlyUpcoming && event.date < currentDateIso) {
      return false;
    }

    // Filtro por busca textual
    if (options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase();
      const inTitle = event.title.toLowerCase().includes(q);
      const inDesc = event.description.toLowerCase().includes(q);
      const inInstructor = event.instructor?.toLowerCase().includes(q);
      const inLocation = event.location.toLowerCase().includes(q);

      if (!inTitle && !inDesc && !inInstructor && !inLocation) {
        return false;
      }
    }

    return true;
  });
};
