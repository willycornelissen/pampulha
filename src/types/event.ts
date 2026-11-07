export type EventType = 'palestra' | 'curso' | 'cultura' | 'voluntariado' | 'outro';

export interface PampulhaEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  date: string; // ISO formato YYYY-MM-DD
  time: string; // formato HH:mm
  location: string;
  instructor?: string;
  registrationUrl?: string; // Link para WhatsApp ou Sympla
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventFilterType = EventType | 'todos';

export interface EventFilterOptions {
  type: EventFilterType;
  onlyUpcoming: boolean;
  searchQuery: string;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  palestra: 'Palestra Pública',
  curso: 'Curso de Filosofia',
  cultura: 'Atividade Cultural',
  voluntariado: 'Ação de Voluntariado',
  outro: 'Geral',
};
