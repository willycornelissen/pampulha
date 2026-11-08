import React from 'react';
import { Calendar, User, Newspaper, ArrowRight } from 'lucide-react';
import { NewsItem, NEWS_CATEGORY_LABELS, NewsCategory } from '../../types/news';

interface NewsCardProps {
  news: NewsItem;
  onSelect: (news: NewsItem) => void;
}

const CATEGORY_BADGES: Record<NewsCategory, string> = {
  comunicado: 'bg-[#f39300]/10 text-[#c97a00] border-[#f39300]/25 dark:bg-[#f39300]/25 dark:text-[#fcd34d] dark:border-[#f39300]/50',
  filosofia: 'bg-[#086357]/10 text-[#086357] border-[#086357]/25 dark:bg-[#086357]/30 dark:text-[#5eead4] dark:border-[#086357]/50',
  cultura: 'bg-[#f39300]/10 text-[#c97a00] border-[#f39300]/25 dark:bg-[#f39300]/25 dark:text-[#fcd34d] dark:border-[#f39300]/50',
  voluntariado: 'bg-[#ed3238]/10 text-[#c0262b] border-[#ed3238]/25 dark:bg-[#ed3238]/25 dark:text-[#fca5a5] dark:border-[#ed3238]/50',
  geral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
};

const formatDate = (dateIso: string): string => {
  const [year, month, day] = dateIso.split('-');
  return `${day}/${month}/${year}`;
};

export const NewsCard: React.FC<NewsCardProps> = ({ news, onSelect }) => {
  return (
    <article
      aria-labelledby={`news-title-${news.id}`}
      className="flex flex-col bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-all group shadow-sm dark:shadow-lg dark:shadow-slate-950/20"
    >
      {/* Imagem de Destaque com Fallback */}
      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
        {news.imageUrl ? (
          <img
            src={news.imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-900">
            <Newspaper className="w-12 h-12" aria-hidden="true" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm ${
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
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#086357] dark:text-[#2dd4bf]" aria-hidden="true" />
              <span>{formatDate(news.publishedAt)}</span>
            </span>
            {news.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#086357] dark:text-[#2dd4bf]" aria-hidden="true" />
                <span>{news.author}</span>
              </span>
            )}
          </div>

          <h3
            id={`news-title-${news.id}`}
            className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-[#086357] dark:group-hover:text-[#2dd4bf] transition-colors"
          >
            {news.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
            {news.summary}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelect(news)}
          aria-label={`Ler notícia completa: ${news.title}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#086357] dark:text-[#2dd4bf] hover:text-[#009485] dark:hover:text-[#5eead4] pt-2 transition-colors focus:outline-none focus:underline"
        >
          <span>Ler Notícia Completa</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};
