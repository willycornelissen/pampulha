import { describe, it, expect, beforeEach } from 'vitest';
import {
  getEvents,
  getEventById,
  filterEvents,
  saveEvent,
  deleteEvent,
  resetEventsToDefault,
} from './eventsService';
import { PampulhaEvent } from '../types/event';

describe('eventsService', () => {
  beforeEach(() => {
    localStorage.clear();
    resetEventsToDefault();
  });

  it('retorna os eventos iniciais ordenados cronologicamente', async () => {
    const events = await getEvents();
    expect(events.length).toBeGreaterThan(0);

    // Verifica ordenação cronológica crescente (data e hora)
    for (let i = 0; i < events.length - 1; i++) {
      const current = `${events[i]!.date}T${events[i]!.time}`;
      const next = `${events[i + 1]!.date}T${events[i + 1]!.time}`;
      expect(current.localeCompare(next)).toBeLessThanOrEqual(0);
    }
  });

  it('busca um evento pelo ID', async () => {
    const events = await getEvents();
    const target = events[0]!;

    const found = await getEventById(target.id);
    expect(found).not.toBeNull();
    expect(found?.title).toBe(target.title);

    const notFound = await getEventById('inexistente');
    expect(notFound).toBeNull();
  });

  it('filtra eventos por tipo de atividade', async () => {
    const events = await getEvents();

    const palestras = filterEvents(events, {
      type: 'palestra',
      onlyUpcoming: false,
      searchQuery: '',
    });

    expect(palestras.length).toBeGreaterThan(0);
    expect(palestras.every((e) => e.type === 'palestra')).toBe(true);
  });

  it('filtra eventos por busca textual no título ou descrição', async () => {
    const events = await getEvents();

    const results = filterEvents(events, {
      type: 'todos',
      onlyUpcoming: false,
      searchQuery: 'platão',
    });

    expect(results.length).toBeGreaterThan(0);
    expect(
      results.some((e) => e.title.toLowerCase().includes('platão') || e.description.toLowerCase().includes('platão'))
    ).toBe(true);
  });

  it('permite criar e atualizar um evento', async () => {
    const newEvent: Omit<PampulhaEvent, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Nova Palestra de Teste',
      description: 'Descrição da palestra',
      type: 'palestra',
      date: '2026-12-01',
      time: '19:00',
      location: 'Sede Pampulha',
      isFree: true,
    };

    const saved = await saveEvent(newEvent);
    expect(saved.id).toBeDefined();
    expect(saved.title).toBe(newEvent.title);

    const fetched = await getEventById(saved.id);
    expect(fetched).not.toBeNull();

    // Atualização
    const updated = await saveEvent({
      ...saved,
      title: 'Título Atualizado',
    });
    expect(updated.title).toBe('Título Atualizado');
  });

  it('permite deletar um evento', async () => {
    const events = await getEvents();
    const toDelete = events[0]!;

    await deleteEvent(toDelete.id);

    const found = await getEventById(toDelete.id);
    expect(found).toBeNull();
  });
});
