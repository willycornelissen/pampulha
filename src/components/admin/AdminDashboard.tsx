import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Database,
  Download,
  Upload,
  Info,
  CloudUpload,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { collection, doc, setDoc, getDocs, query, limit } from 'firebase/firestore';
import { AuthUser } from '../../types/auth';
import { PampulhaEvent, EVENT_TYPE_LABELS } from '../../types/event';
import { NewsItem, NEWS_CATEGORY_LABELS } from '../../types/news';
import { isFirebaseConfigured, getFirestoreDb } from '../../services/firebase';
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

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [firestorePermissionDenied, setFirestorePermissionDenied] = useState(false);

  const isConnectedToFirebase = isFirebaseConfigured();

  useEffect(() => {
    if (!isConnectedToFirebase) return;

    const testFirestoreAccess = async () => {
      const db = getFirestoreDb();
      if (!db) return;
      try {
        const eventsRef = collection(db, 'events');
        await getDocs(query(eventsRef, limit(1)));
        setFirestorePermissionDenied(false);
      } catch (err: any) {
        if (err?.code === 'permission-denied' || String(err?.message || '').toLowerCase().includes('permission')) {
          setFirestorePermissionDenied(true);
        }
      }
    };

    testFirestoreAccess();
  }, [isConnectedToFirebase]);

  const handlePublishToFirebase = async () => {
    const db = getFirestoreDb();
    if (!db) {
      setSyncFeedback({
        type: 'error',
        message: 'Firebase não está configurado nesta instalação.',
      });
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);

    try {
      let eventsToUpload = events;
      if (eventsToUpload.length === 0) {
        try {
          const raw = localStorage.getItem('pampulha_events');
          if (raw) eventsToUpload = JSON.parse(raw);
        } catch {}
      }

      let newsToUpload = news;
      if (newsToUpload.length === 0) {
        try {
          const raw = localStorage.getItem('pampulha_news');
          if (raw) newsToUpload = JSON.parse(raw);
        } catch {}
      }

      for (const evt of eventsToUpload) {
        await setDoc(doc(db, 'events', evt.id), evt);
      }
      for (const item of newsToUpload) {
        await setDoc(doc(db, 'news', item.id), item);
      }
      setFirestorePermissionDenied(false);
      setSyncFeedback({
        type: 'success',
        message: `Sucesso! ${eventsToUpload.length} eventos e ${newsToUpload.length} notícias foram publicados no Firebase. Recarregando página...`,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error('Erro ao sincronizar com Firestore:', err);
      if (err?.code === 'permission-denied' || String(err?.message || '').toLowerCase().includes('permission')) {
        setFirestorePermissionDenied(true);
        setSyncFeedback({
          type: 'error',
          message: 'Permissão negada (PERMISSION_DENIED): as Regras de Segurança do Firestore no Console do Firebase estão bloqueando a gravação.',
        });
      } else {
        setSyncFeedback({
          type: 'error',
          message: `Falha ao enviar dados: ${err.message || 'Erro desconhecido'}`,
        });
      }
    } finally {
      setIsSyncing(false);
    }
  };

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

  const handleExportData = () => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      events,
      news,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dados-pampulha-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const data = JSON.parse(text);
        if (Array.isArray(data.events)) {
          localStorage.setItem('pampulha_events', JSON.stringify(data.events));
        }
        if (Array.isArray(data.news)) {
          localStorage.setItem('pampulha_news', JSON.stringify(data.news));
        }
        window.location.reload();
      } catch (err) {
        alert('Falha ao importar o arquivo. Certifique-se de que é um JSON exportado do painel.');
      }
    };
    reader.readAsText(file);
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Banner explicativo e ferramentas de sincronização quando em Modo Local */}
      {!isConnectedToFirebase && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
              <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Modo Local: dados salvos exclusivamente no navegador deste dispositivo</span>
            </div>
            <p className="text-amber-800 dark:text-amber-300/90 mt-1">
              Para que os eventos e notícias sejam compartilhados em tempo real entre o computador, o celular e todos os visitantes, configure o banco de dados online (Firebase Firestore). Você também pode exportar os dados daqui para importar no celular.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              type="button"
              onClick={handleExportData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Dados</span>
            </button>
            <label
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#086357] hover:bg-[#009485] text-white shadow-sm cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importar Dados</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* Alerta de Permissão do Firebase Firestore (apenas se houver bloqueio de regras) */}
      {isConnectedToFirebase && firestorePermissionDenied && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-rose-900 dark:text-rose-200">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>Regras do Firebase bloqueando acesso (PERMISSION_DENIED)</span>
            </div>
            <p className="text-rose-800 dark:text-rose-300/90 mt-1">
              O Firebase está conectado, mas as <strong>Regras do Firestore</strong> no Console do Firebase estão bloqueando a leitura/gravação.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePublishToFirebase}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white shadow-sm cursor-pointer transition-colors shrink-0"
          >
            {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudUpload className="w-3.5 h-3.5" />}
            <span>{isSyncing ? 'Testando gravação...' : 'Tentar Enviar para o Firebase'}</span>
          </button>
        </div>
      )}

      {syncFeedback && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            syncFeedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          {syncFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{syncFeedback.message}</span>
        </div>
      )}

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
