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
import { NewsItem } from '../types/news';
import { INITIAL_MOCK_NEWS } from './mockData';

const LOCAL_STORAGE_KEY = 'pampulha_news';

export const sortNewsByDateDesc = (items: NewsItem[]): NewsItem[] => {
  return [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
};

const getLocalNews = (): NewsItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_NEWS));
      return INITIAL_MOCK_NEWS;
    }
    const parsed = JSON.parse(raw) as NewsItem[];
    return Array.isArray(parsed) ? parsed : INITIAL_MOCK_NEWS;
  } catch {
    return INITIAL_MOCK_NEWS;
  }
};

const setLocalNews = (items: NewsItem[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
};

export const resetNewsToDefault = (): void => {
  setLocalNews(INITIAL_MOCK_NEWS);
};

export const getNews = async (): Promise<NewsItem[]> => {
  const db = getFirestoreDb();

  if (db) {
    try {
      const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'));
      const snapshot = await getDocs(q);
      const items: NewsItem[] = [];
      snapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as NewsItem);
      });

      // Se o Firestore contiver documentos, utiliza-os
      if (items.length > 0) {
        return sortNewsByDateDesc(items);
      }

      // Se o Firestore estiver vazio (ex.: logo após liberar as Regras),
      // migra os dados salvos localmente neste computador diretamente para o Firestore
      const localNews = getLocalNews();
      if (localNews.length > 0) {
        for (const item of localNews) {
          setDoc(doc(db, 'news', item.id), item).catch(console.warn);
        }
        return sortNewsByDateDesc(localNews);
      }
    } catch (err) {
      console.warn('Erro ao consultar Firestore, usando armazenamento local de notícias:', err);
    }
  }

  return sortNewsByDateDesc(getLocalNews());
};

export const getNewsById = async (id: string): Promise<NewsItem | null> => {
  const db = getFirestoreDb();

  if (db) {
    try {
      const ref = doc(db, 'news', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as NewsItem;
      }
      return null;
    } catch (err) {
      console.warn('Erro ao buscar notícia no Firestore:', err);
    }
  }

  const items = getLocalNews();
  return items.find((n) => n.id === id) || null;
};

export const saveNews = async (
  newsData: Partial<NewsItem> & Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<NewsItem> => {
  const now = new Date().toISOString();
  const db = getFirestoreDb();

  const id = newsData.id || `news-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const fullItem: NewsItem = {
    ...newsData,
    id,
    createdAt: newsData.createdAt || now,
    updatedAt: now,
  };

  if (db) {
    try {
      const ref = doc(db, 'news', id);
      await setDoc(ref, fullItem);
      return fullItem;
    } catch (err) {
      console.warn('Erro ao salvar notícia no Firestore, salvando localmente:', err);
    }
  }

  const items = getLocalNews();
  const index = items.findIndex((n) => n.id === id);

  if (index >= 0) {
    items[index] = fullItem;
  } else {
    items.push(fullItem);
  }

  setLocalNews(items);
  return fullItem;
};

export const deleteNews = async (id: string): Promise<void> => {
  const db = getFirestoreDb();

  if (db) {
    try {
      const ref = doc(db, 'news', id);
      await deleteDoc(ref);
      return;
    } catch (err) {
      console.warn('Erro ao deletar notícia no Firestore, deletando localmente:', err);
    }
  }

  const items = getLocalNews();
  const filtered = items.filter((n) => n.id !== id);
  setLocalNews(filtered);
};
