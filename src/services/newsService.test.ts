import { describe, it, expect, beforeEach } from 'vitest';
import {
  getNews,
  getNewsById,
  saveNews,
  deleteNews,
  resetNewsToDefault,
} from './newsService';
import { NewsItem } from '../types/news';

describe('newsService', () => {
  beforeEach(() => {
    localStorage.clear();
    resetNewsToDefault();
  });

  it('retorna as notícias iniciais ordenadas por data decrescente', async () => {
    const news = await getNews();
    expect(news.length).toBeGreaterThan(0);

    for (let i = 0; i < news.length - 1; i++) {
      expect(news[i]!.publishedAt.localeCompare(news[i + 1]!.publishedAt)).toBeGreaterThanOrEqual(0);
    }
  });

  it('busca uma notícia pelo ID', async () => {
    const news = await getNews();
    const target = news[0]!;

    const found = await getNewsById(target.id);
    expect(found).not.toBeNull();
    expect(found?.title).toBe(target.title);

    const notFound = await getNewsById('inexistente');
    expect(notFound).toBeNull();
  });

  it('permite criar e atualizar uma notícia', async () => {
    const newItem: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Nova Notícia de Teste',
      summary: 'Resumo breve da notícia',
      content: 'Conteúdo detalhado do post...',
      category: 'filosofia',
      publishedAt: '2026-11-06',
      isPublished: true,
    };

    const saved = await saveNews(newItem);
    expect(saved.id).toBeDefined();
    expect(saved.title).toBe(newItem.title);

    const fetched = await getNewsById(saved.id);
    expect(fetched).not.toBeNull();

    const updated = await saveNews({
      ...saved,
      title: 'Título da Notícia Atualizado',
    });
    expect(updated.title).toBe('Título da Notícia Atualizado');
  });

  it('permite deletar uma notícia', async () => {
    const news = await getNews();
    const toDelete = news[0]!;

    await deleteNews(toDelete.id);

    const found = await getNewsById(toDelete.id);
    expect(found).toBeNull();
  });
});
