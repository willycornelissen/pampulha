import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventCard } from './EventCard';
import { EventFilters } from './EventFilters';
import { EventList } from './EventList';
import { PampulhaEvent, EventFilterOptions } from '../../types/event';

const mockEvent: PampulhaEvent = {
  id: 'evt-test-1',
  title: 'Filosofia para Viver com Sabedoria',
  description: 'Introdução aos princípios universais da filosofia prática.',
  type: 'palestra',
  date: '2026-11-15',
  time: '19:30',
  location: 'Nova Acrópole Pampulha',
  instructor: 'Prof. Henrique Alves',
  registrationUrl: 'https://wa.me/5531999999999?text=Inscricao',
  isFree: true,
  createdAt: '2026-11-01T00:00:00Z',
  updatedAt: '2026-11-01T00:00:00Z',
};

describe('Componentes do Calendário', () => {
  describe('EventCard', () => {
    it('renderiza título, detalhes, categoria e link de inscrição', () => {
      render(<EventCard event={mockEvent} currentDateIso="2026-11-10" />);

      expect(screen.getByRole('heading', { level: 3, name: mockEvent.title })).toBeInTheDocument();
      expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
      expect(screen.getByText('Palestra Pública')).toBeInTheDocument();
      expect(screen.getByText('19:30')).toBeInTheDocument();
      expect(screen.getByText('Nova Acrópole Pampulha')).toBeInTheDocument();
      expect(screen.getByText('Prof. Henrique Alves')).toBeInTheDocument();
      expect(screen.getByText('Entrada Gratuita')).toBeInTheDocument();

      const link = screen.getByRole('link', { name: new RegExp(mockEvent.title, 'i') });
      expect(link).toHaveAttribute('href', mockEvent.registrationUrl);
    });

    it('exibe badge "Hoje" quando a data do evento coincide com a data atual', () => {
      render(<EventCard event={mockEvent} currentDateIso="2026-11-15" />);
      expect(screen.getByText('Hoje')).toBeInTheDocument();
    });
  });

  describe('EventFilters', () => {
    const initialFilters: EventFilterOptions = {
      type: 'todos',
      onlyUpcoming: true,
      searchQuery: '',
    };

    it('dispara onChange ao digitar na barra de pesquisa', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <EventFilters
          filters={initialFilters}
          onChange={handleChange}
          totalResults={5}
        />
      );

      const input = screen.getByRole('searchbox', { name: /buscar eventos/i });
      await user.type(input, 'Platão');

      expect(handleChange).toHaveBeenCalled();
    });

    it('dispara onChange ao clicar em um botão de categoria', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <EventFilters
          filters={initialFilters}
          onChange={handleChange}
          totalResults={5}
        />
      );

      const palestraBtn = screen.getByRole('button', { name: 'Palestra Pública' });
      await user.click(palestraBtn);

      expect(handleChange).toHaveBeenCalledWith({
        ...initialFilters,
        type: 'palestra',
      });
    });

    it('não renderiza o botão "Apenas Próximos"', () => {
      render(
        <EventFilters
          filters={initialFilters}
          onChange={vi.fn()}
          totalResults={5}
        />
      );

      expect(screen.queryByRole('button', { name: /apenas próximos/i })).not.toBeInTheDocument();
    });
  });

  describe('EventList', () => {
    it('exibe skeleton de loading quando isLoading for verdadeiro', () => {
      render(<EventList events={[]} isLoading={true} />);
      expect(screen.getByRole('status', { name: /carregando eventos/i })).toBeInTheDocument();
    });

    it('exibe estado vazio e botão de limpar filtros quando não houver eventos', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();

      render(<EventList events={[]} isLoading={false} onClearFilters={handleClear} />);

      expect(screen.getByText('Nenhum evento encontrado')).toBeInTheDocument();

      const clearBtn = screen.getByRole('button', { name: /ver todos os eventos/i });
      await user.click(clearBtn);

      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('renderiza os cards de eventos fornecidos', () => {
      render(<EventList events={[mockEvent]} isLoading={false} />);
      expect(screen.getByRole('heading', { level: 3, name: mockEvent.title })).toBeInTheDocument();
    });
  });
});
