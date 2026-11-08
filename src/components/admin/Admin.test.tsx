import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminLoginModal } from './AdminLoginModal';
import { AdminDashboard } from './AdminDashboard';
import { EventFormModal } from './EventFormModal';
import { NewsFormModal } from './NewsFormModal';
import { AuthUser } from '../../types/auth';
import { PampulhaEvent } from '../../types/event';
import { NewsItem } from '../../types/news';

const mockUser: AuthUser = {
  uid: 'usr-1',
  email: 'admin@pampulha.org',
  displayName: 'Admin Teste',
};

const mockEvent: PampulhaEvent = {
  id: 'evt-1',
  title: 'Evento Teste Admin',
  description: 'Desc',
  type: 'palestra',
  date: '2026-11-20',
  time: '19:30',
  location: 'Sede Pampulha',
  isFree: true,
  createdAt: '2026-11-01T00:00:00Z',
  updatedAt: '2026-11-01T00:00:00Z',
};

const mockNews: NewsItem = {
  id: 'news-1',
  title: 'Notícia Teste Admin',
  summary: 'Resumo',
  content: 'Conteudo',
  category: 'comunicado',
  publishedAt: '2026-11-01',
  isPublished: true,
  createdAt: '2026-11-01T00:00:00Z',
  updatedAt: '2026-11-01T00:00:00Z',
};

describe('Componentes Administrativos', () => {
  describe('AdminLoginModal', () => {
    it('permite preencher e enviar formulário de login com sucesso', async () => {
      const user = userEvent.setup();
      const handleSuccess = vi.fn();
      const handleClose = vi.fn();

      render(
        <AdminLoginModal
          isOpen={true}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      );

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitBtn = screen.getByRole('button', { name: /entrar no painel/i });

      await user.type(emailInput, 'admin@pampulha.org');
      await user.type(passwordInput, 'admin123');
      await user.click(submitBtn);

      expect(handleSuccess).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });

    it('não renderiza quando isOpen é falso', () => {
      render(
        <AdminLoginModal
          isOpen={false}
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('EventFormModal', () => {
    it('permite cadastrar um novo evento preenchendo os campos', async () => {
      const user = userEvent.setup();
      const handleSave = vi.fn();
      const handleClose = vi.fn();

      render(
        <EventFormModal
          isOpen={true}
          event={null}
          onClose={handleClose}
          onSave={handleSave}
        />
      );

      expect(screen.getByRole('heading', { level: 2, name: /novo evento no calendário/i })).toBeInTheDocument();

      const titleInput = screen.getByLabelText(/título da atividade/i);
      await user.clear(titleInput);
      await user.type(titleInput, 'Palestra Especial de Filosofia');

      const submitBtn = screen.getByRole('button', { name: /salvar evento/i });
      await user.click(submitBtn);

      expect(handleSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Palestra Especial de Filosofia',
        })
      );
      expect(handleClose).toHaveBeenCalled();
    });

    it('carrega dados existentes para edição', async () => {
      const handleSave = vi.fn();

      render(
        <EventFormModal
          isOpen={true}
          event={mockEvent}
          onClose={vi.fn()}
          onSave={handleSave}
        />
      );

      expect(screen.getByRole('heading', { level: 2, name: /editar evento do calendário/i })).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockEvent.title)).toBeInTheDocument();
    });
  });

  describe('NewsFormModal', () => {
    it('permite criar uma nova notícia preenchendo os campos', async () => {
      const user = userEvent.setup();
      const handleSave = vi.fn();
      const handleClose = vi.fn();

      render(
        <NewsFormModal
          isOpen={true}
          news={null}
          onClose={handleClose}
          onSave={handleSave}
        />
      );

      expect(screen.getByRole('heading', { level: 2, name: /nova notícia \/ comunicado/i })).toBeInTheDocument();

      const titleInput = screen.getByLabelText(/título da notícia/i);
      const summaryInput = screen.getByLabelText(/resumo breve/i);
      const contentInput = screen.getByLabelText(/conteúdo completo/i);

      await user.type(titleInput, 'Título da Notícia Criada');
      await user.type(summaryInput, 'Resumo do post');
      await user.type(contentInput, 'Conteúdo completo da notícia...');

      const submitBtn = screen.getByRole('button', { name: /salvar notícia/i });
      await user.click(submitBtn);

      expect(handleSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Título da Notícia Criada',
          summary: 'Resumo do post',
        })
      );
      expect(handleClose).toHaveBeenCalled();
    });

    it('exibe pré-visualização quando há imagem e permite remover', async () => {
      const user = userEvent.setup();
      const handleSave = vi.fn();
      const handleClose = vi.fn();
      const newsWithImage: NewsItem = {
        ...mockNews,
        imageUrl: 'https://exemplo.com/foto.jpg',
      };

      render(
        <NewsFormModal
          isOpen={true}
          news={newsWithImage}
          onClose={handleClose}
          onSave={handleSave}
        />
      );

      const previewImg = screen.getByRole('img', { name: /pré-visualização da notícia/i });
      expect(previewImg).toBeInTheDocument();
      expect(previewImg).toHaveAttribute('src', 'https://exemplo.com/foto.jpg');

      const removeBtn = screen.getByRole('button', { name: /remover foto/i });
      await user.click(removeBtn);

      expect(screen.queryByRole('img', { name: /pré-visualização da notícia/i })).not.toBeInTheDocument();

      const submitBtn = screen.getByRole('button', { name: /salvar notícia/i });
      await user.click(submitBtn);

      expect(handleSave).toHaveBeenCalledWith(
        expect.objectContaining({
          imageUrl: undefined,
        })
      );
    });

    it('permite selecionar um arquivo de imagem para upload', async () => {
      const user = userEvent.setup();
      const handleSave = vi.fn();
      const handleClose = vi.fn();

      render(
        <NewsFormModal
          isOpen={true}
          news={null}
          onClose={handleClose}
          onSave={handleSave}
        />
      );

      const titleInput = screen.getByLabelText(/título da notícia/i);
      const summaryInput = screen.getByLabelText(/resumo breve/i);
      const contentInput = screen.getByLabelText(/conteúdo completo/i);
      await user.type(titleInput, 'Notícia com Upload');
      await user.type(summaryInput, 'Resumo com upload');
      await user.type(contentInput, 'Conteúdo com upload');

      const fileInput = document.querySelector<HTMLInputElement>('#news-file-upload');
      expect(fileInput).toBeInTheDocument();

      const fakeFile = new File(['fake-image-bytes'], 'foto-pampulha.jpg', { type: 'image/jpeg' });
      if (fileInput) {
        await user.upload(fileInput, fakeFile);
      }

      const previewImg = await screen.findByRole('img', { name: /pré-visualização da notícia/i });
      expect(previewImg).toBeInTheDocument();

      const submitBtn = screen.getByRole('button', { name: /salvar notícia/i });
      await user.click(submitBtn);

      expect(handleSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Notícia com Upload',
          imageUrl: expect.stringContaining('data:image/'),
        })
      );
    });
  });

  describe('AdminDashboard', () => {
    it('renderiza o painel com as abas de gerenciamento e dados', async () => {
      const user = userEvent.setup();
      const handleSaveEvent = vi.fn();
      const handleDeleteEvent = vi.fn();
      const handleSaveNews = vi.fn();
      const handleDeleteNews = vi.fn();
      const handleLogout = vi.fn();

      render(
        <AdminDashboard
          user={mockUser}
          events={[mockEvent]}
          news={[mockNews]}
          onSaveEvent={handleSaveEvent}
          onDeleteEvent={handleDeleteEvent}
          onSaveNews={handleSaveNews}
          onDeleteNews={handleDeleteNews}
          onLogout={handleLogout}
        />
      );

      expect(screen.getByText('Painel de Gestão Pampulha')).toBeInTheDocument();
      expect(screen.getByText(mockEvent.title)).toBeInTheDocument();

      // Abrir modal de criação de evento
      const addEventBtn = screen.getByRole('button', { name: /adicionar novo evento/i });
      await user.click(addEventBtn);
      expect(screen.getByRole('heading', { level: 2, name: /novo evento no calendário/i })).toBeInTheDocument();

      // Fechar modal
      const closeBtn = screen.getByLabelText(/fechar formulário de evento/i);
      await user.click(closeBtn);

      // Alternar para aba notícias
      const newsTab = screen.getByRole('button', { name: /gerenciar notícias/i });
      await user.click(newsTab);

      expect(screen.getByText(mockNews.title)).toBeInTheDocument();

      // Clicar em logout
      const logoutBtn = screen.getByRole('button', { name: /sair do painel administrativo/i });
      await user.click(logoutBtn);

      expect(handleLogout).toHaveBeenCalledTimes(1);
    });
  });
});
