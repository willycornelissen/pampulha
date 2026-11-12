import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { PampulhaEvent, EventType, EVENT_TYPE_LABELS } from '../../types/event';

interface EventFormModalProps {
  isOpen: boolean;
  event: PampulhaEvent | null;
  onClose: () => void;
  onSave: (eventData: Partial<PampulhaEvent> & Omit<PampulhaEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  event,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EventType>('palestra');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:30');
  const [location, setLocation] = useState('Nova Acrópole Pampulha - Av. Portugal, 1234');
  const [instructor, setInstructor] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setType(event.type);
      setDate(event.date);
      setTime(event.time);
      setLocation(event.location);
      setInstructor(event.instructor || '');
      setRegistrationUrl(event.registrationUrl || '');
      setIsFree(event.isFree);
    } else {
      setTitle('');
      setDescription('');
      setType('palestra');
      setDate(new Date().toISOString().split('T')[0]!);
      setTime('19:30');
      setLocation('Nova Acrópole Pampulha - Av. Portugal, 1234');
      setInstructor('');
      setRegistrationUrl('');
      setIsFree(true);
    }
    setError(null);
  }, [event, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedDate = date.trim();
    const trimmedTime = time.trim();
    const trimmedLocation = location.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedDate || !trimmedTime || !trimmedLocation || !trimmedDescription) {
      setError('Título da atividade, data, horário, localização e descrição são campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const eventPayload: Partial<PampulhaEvent> & Omit<PampulhaEvent, 'id' | 'createdAt' | 'updatedAt'> = {
        id: event?.id,
        title: trimmedTitle,
        description: trimmedDescription,
        type,
        date: trimmedDate,
        time: trimmedTime,
        location: trimmedLocation,
        isFree,
      };

      if (instructor.trim()) {
        eventPayload.instructor = instructor.trim();
      }

      if (registrationUrl.trim()) {
        eventPayload.registrationUrl = registrationUrl.trim();
      }

      await onSave(eventPayload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao salvar evento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-form-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 id="event-form-title" className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {event ? 'Editar Evento do Calendário' : 'Novo Evento no Calendário'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar formulário de evento"
            className="p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="event-title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Título da Atividade *
            </label>
            <input
              id="event-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Como Desenvolver a Força Interior"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#086357]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="event-type-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Categoria *
              </label>
              <select
                id="event-type-select"
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#086357]"
              >
                {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((t) => (
                  <option key={t} value={t}>
                    {EVENT_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="event-instructor-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Instrutor / Palestrante
              </label>
              <input
                id="event-instructor-input"
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="Ex.: Prof. Henrique Alves"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#086357]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="event-date-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Data do Evento *
              </label>
              <input
                id="event-date-input"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#086357]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="event-time-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Horário *
              </label>
              <input
                id="event-time-input"
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#086357]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="event-location-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Localização / Sala *
            </label>
            <input
              id="event-location-input"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex.: Nova Acrópole Pampulha - Sala Platão"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#086357]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="event-desc-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Descrição / Resumo *
            </label>
            <textarea
              id="event-desc-input"
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Resumo do conteúdo programático da atividade..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#086357]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="event-link-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Link de Inscrição / WhatsApp
            </label>
            <input
              id="event-link-input"
              type="url"
              value={registrationUrl}
              onChange={(e) => setRegistrationUrl(e.target.value)}
              placeholder="https://wa.me/5531999999999?text=..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#086357]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="event-free-checkbox"
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="w-4 h-4 rounded text-[#086357] bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-[#086357]"
            />
            <label htmlFor="event-free-checkbox" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Entrada Gratuita
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#086357] hover:bg-[#009485] disabled:opacity-50 text-sm font-bold text-white shadow-lg shadow-[#086357]/20 transition-all"
            >
              {loading ? 'Salvando...' : 'Salvar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
