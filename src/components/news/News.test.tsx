import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewsCard } from './NewsCard';
import { NewsDetailModal } from './NewsDetailModal';
import { NewsList } from './NewsList';
import { NewsItem } from '../../types/news';

const mockNewsItem: NewsItem = {
  id: 'news-test-1',
  title: 'Início das Aulas da Nova Turma de Filosofia',
  summary: 'Turma de quarta-feira inicia jornada de estudos filosóficos.',
  content: 'Texto completo e aprofundado com ensinamentos de Sócrates, Platão e Confúcio.',
  category: 'filosofia',
  publishedAt: '2026-11-05',
  imageUrl: 'https://images.unsplash.com/photo-example',
  author: 'Equipe Pampulha',
  isPublished: true,
  createdAt: '2026-11-05T00:00:00Z',
  updatedAt: '2026-11-05T00:00:00Z',
};

describe('Componentes de Notícias', () => {
  describe('NewsCard', () => {
    it('renderiza título, resumo, categoria e dispara onSelect ao clicar em ler mais', async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();

      render(<NewsCard news={mockNewsItem} onSelect={handleSelect} />);

      expect(screen.getByRole('heading', { level: 3, name: mockNewsItem.title })).toBeInTheDocument();
      expect(screen.getByText(mockNewsItem.summary)).toBeInTheDocument();
      expect(screen.getByText('Artigo / Filosofia')).toBeInTheDocument();
      expect(screen.getByText('05/11/2026')).toBeInTheDocument();
      expect(screen.getByText('Equipe Pampulha')).toBeInTheDocument();

      const btn = screen.getByRole('button', { name: new RegExp(`ler notícia completa: ${mockNewsItem.title}`, 'i') });
      await user.click(btn);

      expect(handleSelect).toHaveBeenCalledWith(mockNewsItem);
    });
  });

  describe('NewsDetailModal', () => {
    it('renderiza os dados completos da notícia e fecha ao clicar no botão fechar ou pressionar Esc', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();

      const { rerender } = render(
        <NewsDetailModal news={mockNewsItem} onClose={handleClose} />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: mockNewsItem.title })).toBeInTheDocument();
      expect(screen.getByText(mockNewsItem.content)).toBeInTheDocument();

      // Fechar pelo botão X
      const closeBtn = screen.getByRole('button', { name: /fechar notícia/i });
      await user.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);

      // Fechar por ESC
      await user.keyboard('{Escape}');
      expect(handleClose).toHaveBeenCalledTimes(2);

      // Não renderiza nada se news for null
      rerender(<NewsDetailModal news={null} onClose={handleClose} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('NewsList', () => {
    it('exibe skeleton quando isLoading for verdadeiro', () => {
      render(<NewsList news={[]} isLoading={true} />);
      expect(screen.getByRole('status', { name: /carregando notícias/i })).toBeInTheDocument();
    });

    it('exibe empty state quando lista for vazia', () => {
      render(<NewsList news={[]} isLoading={false} />);
      expect(screen.getByText('Nenhuma notícia publicada')).toBeInTheDocument();
    });

    it('renderiza os cards e abre modal ao clicar em ler mais', async () => {
      const user = userEvent.setup();
      render(<NewsList news={[mockNewsItem]} isLoading={false} />);

      expect(screen.getByRole('heading', { level: 3, name: mockNewsItem.title })).toBeInTheDocument();

      // Clica em ler mais
      const readMoreBtn = screen.getByRole('button', { name: new RegExp(`ler notícia completa: ${mockNewsItem.title}`, 'i') });
      await user.click(readMoreBtn);

      // Modal abre
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(mockNewsItem.content)).toBeInTheDocument();
    });
  });
});
