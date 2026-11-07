import React from 'react';
import { Calendar, User, Newspaper, ArrowRight } from 'lucide-react';
import { NewsItem, NEWS_CATEGORY_LABELS, NewsCategory } from '../../types/news';

interface NewsCardProps {
  news: NewsItem;
  onSelect: (news: NewsItem) => void;
}

const CATEGORY_BADGES: Record<NewsCategory, string> = {
  comunicado: 'bg-amber-900/60 text-amber-300 border-amber-700/60',
  filosofia: 'bg-indigo-900/60 text-indigo-300 border-indigo-700/60',
  cultura: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60',
  voluntariado: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/60',
  geral: 'bg-slate-800 text-slate-300 border-slate-700',
};

const formatDate = (dateIso: string): string => {
  const [year, month, day] = dateIso.split('-');
  return `${day}/${month}/${year}`;
};

export const NewsCard: React.FC<NewsCardProps> = ({ news, onSelect }) => {
  return (
    <article
      aria-labelledby={`news-title-${news.id}`}
      className="flex flex-col bg-slate-800/50 border border-slate-700/70 rounded-2xl overflow-hidden hover:border-slate-600 hover:bg-slate-800/80 transition-all group shadow-lg shadow-slate-950/20"
    >
      {/* Imagem de Destaque com Fallback */}
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
        {news.imageUrl ? (
          <img
            src={news.imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
            <Newspaper className="w-12 h-12" aria-hidden="true" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md ${
              CATEGORY_BADGES[news.category] || CATEGORY_BADGES.geral
            }`}
          >
            {NEWS_CATEGORY_LABELS[news.category]}
          </span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs text-slate-400">
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

          <h3
            id={`news-title-${news.id}`}
            className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-indigo-300 transition-colors"
          >
            {news.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
            {news.summary}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelect(news)}
          aria-label={`Ler notícia completa: ${news.title}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 pt-2 transition-colors focus:outline-none focus:underline"
        >
          <span>Ler Notícia Completa</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};
