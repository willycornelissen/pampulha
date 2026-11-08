import React, { useState } from 'react';
import { Newspaper } from 'lucide-react';
import { NewsItem } from '../../types/news';
import { NewsCard } from './NewsCard';
import { NewsDetailModal } from './NewsDetailModal';

interface NewsListProps {
  news: NewsItem[];
  isLoading?: boolean;
}

export const NewsList: React.FC<NewsListProps> = ({ news, isLoading = false }) => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Carregando notícias">
        <span className="sr-only">Carregando notícias...</span>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 rounded-2xl h-80 overflow-hidden animate-pulse"
          >
            <div className="h-44 bg-slate-200 dark:bg-slate-700/50 w-full" />
            <div className="p-5 space-y-3 flex-1">
              <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700/40 rounded" />
              <div className="w-full h-5 bg-slate-200 dark:bg-slate-700/50 rounded" />
              <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-700/40 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <Newspaper className="w-6 h-6 text-slate-500 dark:text-slate-400" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Nenhuma notícia publicada</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          Fique atento! Em breve novas publicações e comunicados da Nova Acrópole Pampulha estarão disponíveis aqui.
        </p>
      </div>
    );
  }

  return (
    <>
      <section aria-label="Feed de notícias da Nova Acrópole Pampulha" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <NewsCard
            key={item.id}
            news={item}
            onSelect={(selected) => setSelectedNews(selected)}
          />
        ))}
      </section>

      <NewsDetailModal
        news={selectedNews}
        onClose={() => setSelectedNews(null)}
      />
    </>
  );
};
