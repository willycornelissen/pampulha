import React from 'react';
import { Clock, MapPin, User, MessageCircle, ExternalLink } from 'lucide-react';
import { PampulhaEvent, EVENT_TYPE_LABELS, EventType } from '../../types/event';

interface EventCardProps {
  event: PampulhaEvent;
  currentDateIso?: string;
}

const BADGE_STYLES: Record<EventType, string> = {
  palestra: 'bg-indigo-900/60 text-indigo-300 border-indigo-700/60',
  curso: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60',
  cultura: 'bg-amber-900/60 text-amber-300 border-amber-700/60',
  voluntariado: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/60',
  outro: 'bg-slate-800 text-slate-300 border-slate-700',
};

export const formatDatePtBR = (dateIso: string): { day: string; month: string; weekday: string } => {
  // Parsing seguro de YYYY-MM-DD
  const [yearStr, monthStr, dayStr] = dateIso.split('-');
  const date = new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr));

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');

  return { day, month, weekday };
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  currentDateIso = new Date().toISOString().split('T')[0]!,
}) => {
  const { day, month, weekday } = formatDatePtBR(event.date);
  const isToday = event.date === currentDateIso;
  const isPast = event.date < currentDateIso;

  return (
    <article
      aria-labelledby={`event-title-${event.id}`}
      className={`relative flex flex-col md:flex-row gap-4 p-5 rounded-2xl border transition-all ${
        isToday
          ? 'bg-indigo-950/30 border-indigo-500/70 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/50'
          : isPast
          ? 'bg-slate-900/40 border-slate-800/80 opacity-75'
          : 'bg-slate-800/50 border-slate-700/70 hover:border-slate-600 hover:bg-slate-800/80'
      }`}
    >
      {/* Bloco de Data Cronológica */}
      <div className="flex md:flex-col items-center justify-between md:justify-center md:w-24 shrink-0 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
          {weekday}
        </span>
        <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {day}
        </span>
        <span className="text-xs font-bold text-indigo-400 tracking-wider">
          {month}
        </span>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              BADGE_STYLES[event.type] || BADGE_STYLES.outro
            }`}
          >
            {EVENT_TYPE_LABELS[event.type]}
          </span>

          {isToday && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500 text-white animate-pulse">
              Hoje
            </span>
          )}

          {event.isFree && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              Entrada Gratuita
            </span>
          )}
        </div>

        <h3
          id={`event-title-${event.id}`}
          className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug"
        >
          {event.title}
        </h3>

        <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
          {event.description}
        </p>

        {/* Metadados / Detalhes Visíveis */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" aria-hidden="true" />
            <span>{event.time}</span>
          </span>

          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" aria-hidden="true" />
            <span>{event.location}</span>
          </span>

          {event.instructor && (
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" aria-hidden="true" />
              <span>{event.instructor}</span>
            </span>
          )}
        </div>
      </div>

      {/* Ação de Inscrição / Contato */}
      {event.registrationUrl && (
        <div className="flex md:flex-col justify-end items-stretch md:justify-center shrink-0 pt-2 md:pt-0">
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Inscrever-se no evento: ${event.title}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {event.registrationUrl.includes('wa.me') ? (
              <>
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Inscrever-se</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                <span>Mais Info</span>
              </>
            )}
          </a>
        </div>
      )}
    </article>
  );
};
