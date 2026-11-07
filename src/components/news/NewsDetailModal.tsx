import React, { useEffect } from 'react';
import { X, Calendar, User } from 'lucide-react';
import { NewsItem, NEWS_CATEGORY_LABELS } from '../../types/news';

interface NewsDetailModalProps {
  news: NewsItem | null;
  onClose: () => void;
}

const formatDate = (dateIso: string): string => {
  const [year, month, day] = dateIso.split('-');
  return `${day}/${month}/${year}`;
};

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (news) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [news, onClose]);

  if (!news) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-news-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar notícia"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Imagem de Destaque se existir */}
        {news.imageUrl && (
          <div className="relative h-60 sm:h-72 w-full bg-slate-950 shrink-0">
            <img
              src={news.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/60">
                {NEWS_CATEGORY_LABELS[news.category]}
              </span>

              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                <span>{formatDate(news.publishedAt)}</span>
              </span>

              {news.author && (
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                  <span>{news.author}</span>
                </span>
              )}
            </div>

            <h2
              id="modal-news-title"
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight"
            >
              {news.title}
            </h2>
          </div>

          <p className="text-base font-medium text-slate-300 italic border-l-2 border-indigo-500 pl-4 py-1">
            {news.summary}
          </p>

          <div className="text-sm text-slate-300 leading-relaxed space-y-4 pt-2 whitespace-pre-line">
            {news.content}
          </div>
        </div>

        {/* Rodapé com botão Fechar */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
