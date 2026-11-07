import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Newspaper,
  Lock,
  Sparkles,
  MapPin,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { PampulhaEvent, EventFilterOptions } from './types/event';
import { NewsItem } from './types/news';
import { AuthUser } from './types/auth';
import {
  getEvents,
  saveEvent,
  deleteEvent,
  filterEvents,
  resetEventsToDefault,
} from './services/eventsService';
import {
  getNews,
  saveNews,
  deleteNews,
  resetNewsToDefault,
} from './services/newsService';
import {
  getCurrentUser,
  logoutUser,
  subscribeToAuthChanges,
} from './services/authService';
import { isFirebaseConfigured } from './services/firebase';
import { EventFilters } from './components/calendar/EventFilters';
import { EventList } from './components/calendar/EventList';
import { NewsList } from './components/news/NewsList';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'news' | 'admin'>('calendar');
  const [events, setEvents] = useState<PampulhaEvent[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getCurrentUser());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Filtros de eventos
  const [eventFilters, setEventFilters] = useState<EventFilterOptions>({
    type: 'todos',
    onlyUpcoming: true,
    searchQuery: '',
  });

  const isConnectedToFirebase = isFirebaseConfigured();

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedEvents, fetchedNews] = await Promise.all([
        getEvents(),
        getNews(),
      ]);
      setEvents(fetchedEvents);
      setNews(fetchedNews);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveEvent = async (
    data: Partial<PampulhaEvent> & Omit<PampulhaEvent, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    await saveEvent(data);
    const updated = await getEvents();
    setEvents(updated);
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
    const updated = await getEvents();
    setEvents(updated);
  };

  const handleSaveNews = async (
    data: Partial<NewsItem> & Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    await saveNews(data);
    const updated = await getNews();
    setNews(updated);
  };

  const handleDeleteNews = async (id: string) => {
    await deleteNews(id);
    const updated = await getNews();
    setNews(updated);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setActiveTab('calendar');
  };

  const handleResetDemoData = async () => {
    if (window.confirm('Deseja restaurar os eventos e notícias padrão de demonstração?')) {
      resetEventsToDefault();
      resetNewsToDefault();
      await loadData();
    }
  };

  const filteredEvents = filterEvents(events, eventFilters);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Topo / Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-indigo-600/30">
              NA
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                Nova Acrópole Pampulha
              </h1>
              <p className="text-[11px] text-slate-400 tracking-wide font-medium">
                Filosofia &bull; Cultura &bull; Voluntariado
              </p>
            </div>
          </div>

          {/* Navegação Principal */}
          <nav aria-label="Navegação Principal" className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              aria-pressed={activeTab === 'calendar'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'calendar'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>Calendário</span>
              <span className="hidden sm:inline-block ml-1 px-1.5 py-0.2 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-700/50">
                {events.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('news')}
              aria-pressed={activeTab === 'news'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'news'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Newspaper className="w-4 h-4" aria-hidden="true" />
              <span>Notícias</span>
              <span className="hidden sm:inline-block ml-1 px-1.5 py-0.2 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-700/50">
                {news.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentUser) {
                  setActiveTab('admin');
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              aria-pressed={activeTab === 'admin'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                currentUser
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-700/60 hover:bg-indigo-900/60'
                  : 'text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{currentUser ? 'Painel Admin' : 'Admin'}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Visualização de Calendário */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/60 text-indigo-400 border border-indigo-800/50">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Programação da Sede
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Calendário de Atividades
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Confira as palestras públicas gratuitas, aulas inaugurais do Curso de Filosofia Prática e ações culturais abertas na sede Pampulha.
              </p>
            </div>

            <EventFilters
              filters={eventFilters}
              onChange={setEventFilters}
              totalResults={filteredEvents.length}
            />

            <EventList
              events={filteredEvents}
              isLoading={loading}
              onClearFilters={() =>
                setEventFilters({
                  type: 'todos',
                  onlyUpcoming: false,
                  searchQuery: '',
                })
              }
            />
          </div>
        )}

        {/* Visualização de Notícias */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/60 text-indigo-400 border border-indigo-800/50">
                <Newspaper className="w-3.5 h-3.5" aria-hidden="true" />
                Informativo &bull; Sede Pampulha
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Últimas Notícias e Artigos
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Fique por dentro dos acontecimentos, projetos sociais de voluntariado e artigos de reflexão filosófica da nossa comunidade.
              </p>
            </div>

            <NewsList news={news} isLoading={loading} />
          </div>
        )}

        {/* Visualização de Administração */}
        {activeTab === 'admin' && (
          <div>
            {currentUser ? (
              <AdminDashboard
                user={currentUser}
                events={events}
                news={news}
                onSaveEvent={handleSaveEvent}
                onDeleteEvent={handleDeleteEvent}
                onSaveNews={handleSaveNews}
                onDeleteNews={handleDeleteNews}
                onLogout={handleLogout}
              />
            ) : (
              <div className="text-center py-16 px-6 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Lock className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-white">Acesso Restrito à Gestão</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Você precisa estar autenticado com uma conta administrativa para gerenciar o calendário e as notícias da sede Pampulha.
                </p>
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition-all"
                >
                  Entrar no Painel
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Rodapé com Informações Institucionais da Sede */}
      <footer className="bg-slate-950 border-t border-slate-800/80 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                Nova Acrópole Pampulha
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Escola Internacional de Filosofia à Maneira Clássica. Promovendo a filosofia prática, a cultura humanista e o voluntariado em Belo Horizonte.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                Onde nos Encontrar
              </h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Av. Portugal, Região da Pampulha, Belo Horizonte - MG</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
                  <span>Segunda a Sexta: 14h às 21h &bull; Sábados: 09h às 13h</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                Tecnologia &amp; Dados
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isConnectedToFirebase
                  ? 'Sincronizado em tempo real com Google Firebase Firestore.'
                  : 'Operando em Modo de Demonstração / LocalStorage (Vite SPA no GitHub Pages).'}
              </p>

              <button
                type="button"
                onClick={handleResetDemoData}
                className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <RefreshCw className="w-3 h-3" aria-hidden="true" />
                <span>Restaurar dados de exemplo</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>&copy; {new Date().getFullYear()} Nova Acrópole Pampulha &bull; Todos os direitos reservados.</p>
            <p className="font-mono text-[11px] text-slate-400">
              Desenvolvido com React 19, TypeScript, Vite &amp; Tailwind CSS
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Login Administrativo */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setActiveTab('admin');
        }}
      />
    </div>
  );
};

export default App;
