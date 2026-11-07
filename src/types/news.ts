export type NewsCategory = 'comunicado' | 'filosofia' | 'cultura' | 'voluntariado' | 'geral';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  publishedAt: string; // ISO formato YYYY-MM-DD
  imageUrl?: string;
  author?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  comunicado: 'Comunicado Oficial',
  filosofia: 'Artigo / Filosofia',
  cultura: 'Cultura & Arte',
  voluntariado: 'Ação Social',
  geral: 'Notícia Geral',
};
