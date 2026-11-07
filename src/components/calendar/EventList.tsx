import React from 'react';
import { Calendar, SearchX } from 'lucide-react';
import { PampulhaEvent } from '../../types/event';
import { EventCard } from './EventCard';

interface EventListProps {
  events: PampulhaEvent[];
  isLoading?: boolean;
  onClearFilters?: () => void;
  currentDateIso?: string;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  isLoading = false,
  onClearFilters,
  currentDateIso,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4" role="status" aria-label="Carregando eventos">
        <span className="sr-only">Carregando lista de eventos...</span>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-4 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/40 animate-pulse"
          >
            <div className="w-full md:w-24 h-20 bg-slate-700/50 rounded-xl" />
            <div className="flex-1 space-y-3">
              <div className="w-28 h-5 bg-slate-700/50 rounded-full" />
              <div className="w-3/4 h-6 bg-slate-700/50 rounded" />
              <div className="w-full h-4 bg-slate-700/40 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
          <SearchX className="w-6 h-6 text-slate-400" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Nenhum evento encontrado</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Não encontramos atividades correspondentes aos filtros selecionados. Tente ajustar os termos de busca ou a categoria.
          </p>
        </div>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md"
          >
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Ver Todos os Eventos</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <section aria-label="Lista cronológica de eventos" className="space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} currentDateIso={currentDateIso} />
      ))}
    </section>
  );
};
