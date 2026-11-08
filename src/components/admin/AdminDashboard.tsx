import React, { useState } from 'react';
import {
  Calendar,
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Database,
} from 'lucide-react';
import { AuthUser } from '../../types/auth';
import { PampulhaEvent, EVENT_TYPE_LABELS } from '../../types/event';
import { NewsItem, NEWS_CATEGORY_LABELS } from '../../types/news';
import { isFirebaseConfigured } from '../../services/firebase';
import { EventFormModal } from './EventFormModal';
import { NewsFormModal } from './NewsFormModal';

interface AdminDashboardProps {
  user: AuthUser;
  events: PampulhaEvent[];
  news: NewsItem[];
  onSaveEvent: (data: Partial<PampulhaEvent> & Omit<PampulhaEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
  onSaveNews: (data: Partial<NewsItem> & Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  events,
  news,
  onSaveEvent,
  onDeleteEvent,
  onSaveNews,
  onDeleteNews,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'news'>('events');
  const [editingEvent, setEditingEvent] = useState<PampulhaEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);

  const isConnectedToFirebase = isFirebaseConfigured();

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: PampulhaEvent) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDeleteEventClick = async (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o evento "${title}"?`)) {
      await onDeleteEvent(id);
    }
  };

  const handleCreateNews = () => {
    setEditingNews(null);
    setIsNewsModalOpen(true);
  };

  const handleEditNews = (item: NewsItem) => {
    setEditingNews(item);
    setIsNewsModalOpen(true);
  };

  const handleDeleteNewsClick = async (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a notícia "${title}"?`)) {
      await onDeleteNews(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Status do Painel Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#086357]/10 dark:bg-[#086357]/30 text-[#086357] dark:text-[#5eead4] flex items-center justify-center font-bold">
            ADM
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Painel de Gestão Pampulha
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Conectado como <span className="text-slate-800 dark:text-slate-200 font-semibold">{user.email || user.displayName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnectedToFirebase ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Firebase Firestore Ativo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
              <Database className="w-3.5 h-3.5" aria-hidden="true" />
              Modo Local / Demonstração
            </span>
          )}

          <button
            type="button"
            onClick={onLogout}
            aria-label="Sair do painel administrativo"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Navegação entre Abas do Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            aria-pressed={activeTab === 'events'}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'events'
                ? 'bg-[#086357] text-white shadow-lg shadow-[#086357]/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-[#086357] dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>Gerenciar Calendário ({events.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('news')}
            aria-pressed={activeTab === 'news'}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'news'
                ? 'bg-[#086357] text-white shadow-lg shadow-[#086357]/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-[#086357] dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Newspaper className="w-4 h-4" aria-hidden="true" />
            <span>Gerenciar Notícias ({news.length})</span>
          </button>
        </div>

        {activeTab === 'events' ? (
          <button
            type="button"
            onClick={handleCreateEvent}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#086357] hover:bg-[#009485] text-white transition-all shadow-md shadow-[#086357]/20"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Adicionar Novo Evento</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCreateNews}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#086357] hover:bg-[#009485] text-white transition-all shadow-md shadow-[#086357]/20"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Publicar Nova Notícia</span>
          </button>
        )}
      </div>

      {/* Conteúdo da Aba Eventos */}
      {activeTab === 'events' && (
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm shadow-sm">
              Nenhum evento cadastrado no momento.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th scope="col" className="px-4 py-3">Data / Hora</th>
                    <th scope="col" className="px-4 py-3">Título</th>
                    <th scope="col" className="px-4 py-3">Categoria</th>
                    <th scope="col" className="px-4 py-3">Local</th>
                    <th scope="col" className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-mono font-medium text-[#086357] dark:text-[#5eead4]">
                        {evt.date} às {evt.time}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                        {evt.title}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {EVENT_TYPE_LABELS[evt.type]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {evt.location}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditEvent(evt)}
                          aria-label={`Editar evento: ${evt.title}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#086357] dark:hover:text-[#5eead4] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEventClick(evt.id, evt.title)}
                          aria-label={`Excluir evento: ${evt.title}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo da Aba Notícias */}
      {activeTab === 'news' && (
        <div className="space-y-3">
          {news.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm shadow-sm">
              Nenhuma notícia cadastrada no momento.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th scope="col" className="px-4 py-3">Data</th>
                    <th scope="col" className="px-4 py-3">Título</th>
                    <th scope="col" className="px-4 py-3">Categoria</th>
                    <th scope="col" className="px-4 py-3">Autor</th>
                    <th scope="col" className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {news.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-[#086357] dark:text-[#5eead4]">
                        {item.publishedAt}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white max-w-sm truncate">
                        {item.title}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {NEWS_CATEGORY_LABELS[item.category]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {item.author || 'Pampulha'}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditNews(item)}
                          aria-label={`Editar notícia: ${item.title}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#086357] dark:hover:text-[#5eead4] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNewsClick(item.id, item.title)}
                          aria-label={`Excluir notícia: ${item.title}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modais de Formulários */}
      <EventFormModal
        isOpen={isEventModalOpen}
        event={editingEvent}
        onClose={() => setIsEventModalOpen(false)}
        onSave={onSaveEvent}
      />

      <NewsFormModal
        isOpen={isNewsModalOpen}
        news={editingNews}
        onClose={() => setIsNewsModalOpen(false)}
        onSave={onSaveNews}
      />
    </div>
  );
};
