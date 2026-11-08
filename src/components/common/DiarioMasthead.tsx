import React from 'react';

export interface DiarioMastheadProps {
  activeTab?: 'calendar' | 'news' | 'admin';
  onTabChange?: (tab: 'calendar' | 'news') => void;
  eventsCount?: number;
  newsCount?: number;
}

export const formatNewspaperDate = (date: Date = new Date()): string => {
  const formatted = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  // Capitaliza a primeira letra do dia da semana
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const DiarioMasthead: React.FC<DiarioMastheadProps> = () => {
  const formattedDate = formatNewspaperDate();

  return (
    <section
      aria-label="Frontispício do Diário da Pampulha"
      className="w-full pt-4 pb-2 text-stone-900 dark:text-stone-100 transition-colors"
    >
      {/* Moldura de Fio Duplo Superior (Linotipo Clássico) */}
      <div className="border-t-2 border-b border-stone-800 dark:border-stone-700 py-1.5 transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs tracking-wider uppercase font-semibold text-stone-600 dark:text-stone-400 gap-1 text-center">
          <div className="flex items-center gap-2">
            <span>Belo Horizonte &bull; MG</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline">Sede Pampulha</span>
          </div>

          <div className="font-medium tracking-normal capitalize sm:tracking-wider">
            {formattedDate}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span>Edição Aberta</span>
            <span>&bull;</span>
            <span>Distribuição Gratuita</span>
          </div>
        </div>
      </div>

      {/* Título Principal com Tipografia Clássica Romana / Renascentista */}
      <div className="py-4 sm:py-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <span className="hidden sm:block h-px w-12 bg-stone-400 dark:bg-stone-600" aria-hidden="true" />
          <span className="text-xs uppercase tracking-widest text-[#086357] dark:text-[#2dd4bf] font-bold font-mono">
            &bull; Nova Acrópole Pampulha &bull;
          </span>
          <span className="hidden sm:block h-px w-12 bg-stone-400 dark:bg-stone-600" aria-hidden="true" />
        </div>

        <h1
          id="masthead-title"
          className="font-masthead text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight sm:tracking-wider text-stone-900 dark:text-white drop-shadow-xs transition-colors"
        >
          Diário da Pampulha
        </h1>

        <p className="font-editorial italic text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl mx-auto leading-relaxed transition-colors">
          A Nova Acrópole é uma Escola de Filosofia que promove a cultura e pratica o voluntariado
        </p>
      </div>

      {/* Moldura de Fio Duplo Inferior (Linotipo Clássico) */}
      <div className="border-t border-b-2 border-stone-800 dark:border-stone-700 py-1.5 transition-colors">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
          <span>Nova Acrópole &bull; Escola de Filosofia</span>
          <span>Bairro Castelo &bull; Belo Horizonte</span>
        </div>
      </div>
    </section>
  );
};

export default DiarioMasthead;
