import React from 'react';
import { Clock, MapPin, User, MessageCircle, ExternalLink } from 'lucide-react';
import { PampulhaEvent, EVENT_TYPE_LABELS, EventType } from '../../types/event';

interface EventCardProps {
  event: PampulhaEvent;
  currentDateIso?: string;
}

const BADGE_STYLES: Record<EventType, string> = {
  palestra: 'bg-[#086357]/10 text-[#086357] border-[#086357]/25 dark:bg-[#086357]/30 dark:text-[#5eead4] dark:border-[#086357]/50',
  curso: 'bg-[#009485]/10 text-[#009485] border-[#009485]/25 dark:bg-[#009485]/30 dark:text-[#5eead4] dark:border-[#009485]/50',
  cultura: 'bg-[#f39300]/10 text-[#c97a00] border-[#f39300]/25 dark:bg-[#f39300]/25 dark:text-[#fcd34d] dark:border-[#f39300]/50',
  voluntariado: 'bg-[#ed3238]/10 text-[#c0262b] border-[#ed3238]/25 dark:bg-[#ed3238]/25 dark:text-[#fca5a5] dark:border-[#ed3238]/50',
  outro: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
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
          ? 'bg-[#f0fdf9] border-[#086357]/40 shadow-md ring-1 ring-[#086357]/30 dark:bg-[#086357]/15 dark:border-[#009485]/50 dark:shadow-emerald-950/40 dark:ring-[#009485]/40'
          : isPast
          ? 'bg-slate-100/70 border-slate-200 opacity-75 dark:bg-slate-900/40 dark:border-slate-800/80'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-sm dark:bg-slate-800/50 dark:border-slate-700/70 dark:hover:border-slate-600 dark:hover:bg-slate-800/80'
      }`}
    >
      {/* Bloco de Data Cronológica */}
      <div className="flex md:flex-col items-center justify-between md:justify-center md:w-24 shrink-0 p-3 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
          {weekday}
        </span>
        <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {day}
        </span>
        <span className="text-xs font-bold text-[#086357] dark:text-[#2dd4bf] tracking-wider">
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
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f39300] text-white animate-pulse">
              Hoje
            </span>
          )}

          {event.isFree && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#086357]/10 text-[#086357] border border-[#086357]/20 dark:bg-[#086357]/30 dark:text-[#5eead4] dark:border-[#086357]/50">
              Entrada Gratuita
            </span>
          )}
        </div>

        <h3
          id={`event-title-${event.id}`}
          className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug"
        >
          {event.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {event.description}
        </p>

        {/* Metadados / Detalhes Visíveis */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#086357] dark:text-[#2dd4bf] shrink-0" aria-hidden="true" />
            <span>{event.time}</span>
          </span>

          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#086357] dark:text-[#2dd4bf] shrink-0" aria-hidden="true" />
            <span>{event.location}</span>
          </span>

          {event.instructor && (
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#086357] dark:text-[#2dd4bf] shrink-0" aria-hidden="true" />
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
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#086357] hover:bg-[#009485] text-white text-xs font-bold transition-all shadow-md shadow-[#086357]/20 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#009485]"
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
