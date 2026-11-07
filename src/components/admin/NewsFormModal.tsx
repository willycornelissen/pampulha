import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { NewsItem, NewsCategory, NEWS_CATEGORY_LABELS } from '../../types/news';

interface NewsFormModalProps {
  isOpen: boolean;
  news: NewsItem | null;
  onClose: () => void;
  onSave: (newsData: Partial<NewsItem> & Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const NewsFormModal: React.FC<NewsFormModalProps> = ({
  isOpen,
  news,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NewsCategory>('filosofia');
  const [publishedAt, setPublishedAt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setSummary(news.summary);
      setContent(news.content);
      setCategory(news.category);
      setPublishedAt(news.publishedAt);
      setImageUrl(news.imageUrl || '');
      setAuthor(news.author || '');
      setIsPublished(news.isPublished);
    } else {
      setTitle('');
      setSummary('');
      setContent('');
      setCategory('filosofia');
      setPublishedAt(new Date().toISOString().split('T')[0]!);
      setImageUrl('');
      setAuthor('Comunicação Pampulha');
      setIsPublished(true);
    }
    setError(null);
  }, [news, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !summary.trim() || !content.trim()) {
      setError('Título, resumo e conteúdo completo são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        id: news?.id,
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        category,
        publishedAt,
        imageUrl: imageUrl.trim() || undefined,
        author: author.trim() || undefined,
        isPublished,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao salvar notícia.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-form-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 id="news-form-title" className="text-xl font-bold text-white tracking-tight">
            {news ? 'Editar Notícia' : 'Nova Notícia / Comunicado'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar formulário de notícia"
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="news-title-input" className="block text-xs font-semibold text-slate-300">
              Título da Notícia *
            </label>
            <input
              id="news-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Nova Acrópole Pampulha abre inscrições"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="news-category-select" className="block text-xs font-semibold text-slate-300">
                Categoria *
              </label>
              <select
                id="news-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {(Object.keys(NEWS_CATEGORY_LABELS) as NewsCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {NEWS_CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="news-date-input" className="block text-xs font-semibold text-slate-300">
                Data de Publicação *
              </label>
              <input
                id="news-date-input"
                type="date"
                required
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="news-author-input" className="block text-xs font-semibold text-slate-300">
                Autor / Departamento
              </label>
              <input
                id="news-author-input"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex.: Comunicação Pampulha"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="news-image-input" className="block text-xs font-semibold text-slate-300">
                URL da Imagem de Destaque
              </label>
              <input
                id="news-image-input"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="news-summary-input" className="block text-xs font-semibold text-slate-300">
              Resumo Breve (Exibido no Card) *
            </label>
            <textarea
              id="news-summary-input"
              rows={2}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Uma frase sucinta resumindo a notícia..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="news-content-input" className="block text-xs font-semibold text-slate-300">
              Conteúdo Completo *
            </label>
            <textarea
              id="news-content-input"
              rows={5}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva aqui o artigo completo..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-slate-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm font-bold text-white shadow-lg transition-all"
            >
              {loading ? 'Salvando...' : 'Salvar Notícia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
