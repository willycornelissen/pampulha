import React from 'react';
import { Search, Filter, CalendarCheck } from 'lucide-react';
import { EventFilterOptions, EventFilterType, EVENT_TYPE_LABELS } from '../../types/event';

interface EventFiltersProps {
  filters: EventFilterOptions;
  onChange: (filters: EventFilterOptions) => void;
  totalResults: number;
}

const FILTER_BUTTONS: { type: EventFilterType; label: string }[] = [
  { type: 'todos', label: 'Todos os Eventos' },
  { type: 'palestra', label: EVENT_TYPE_LABELS.palestra },
  { type: 'curso', label: EVENT_TYPE_LABELS.curso },
  { type: 'cultura', label: EVENT_TYPE_LABELS.cultura },
  { type: 'voluntariado', label: EVENT_TYPE_LABELS.voluntariado },
];

export const EventFilters: React.FC<EventFiltersProps> = ({
  filters,
  onChange,
  totalResults,
}) => {
  const handleTypeSelect = (type: EventFilterType) => {
    onChange({ ...filters, type });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, searchQuery: e.target.value });
  };

  const handleToggleUpcoming = () => {
    onChange({ ...filters, onlyUpcoming: !filters.onlyUpcoming });
  };

  return (
    <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Barra de Pesquisa */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar por tema, palestrante ou palavra-chave..."
            aria-label="Buscar eventos"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Checkbox / Botão Alternar Apenas Futuros */}
        <button
          type="button"
          onClick={handleToggleUpcoming}
          aria-pressed={filters.onlyUpcoming}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
            filters.onlyUpcoming
              ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/60'
              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
        >
          <CalendarCheck className="w-4 h-4" aria-hidden="true" />
          <span>Apenas Próximos</span>
        </button>
      </div>

      {/* Pílulas de Categoria */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none" role="group" aria-label="Filtrar por categoria de evento">
        <span className="text-xs text-slate-400 flex items-center gap-1.5 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
          <span>Categorias:</span>
        </span>

        {FILTER_BUTTONS.map((btn) => {
          const isActive = filters.type === btn.type;
          return (
            <button
              key={btn.type}
              type="button"
              onClick={() => handleTypeSelect(btn.type)}
              aria-pressed={isActive}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      <div className="text-xs text-slate-400 font-medium">
        Exibindo <span className="text-indigo-400 font-bold">{totalResults}</span> {totalResults === 1 ? 'evento encontrado' : 'eventos encontrados'}.
      </div>
    </div>
  );
};
