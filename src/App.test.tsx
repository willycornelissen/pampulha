import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { resetEventsToDefault } from './services/eventsService';
import { resetNewsToDefault } from './services/newsService';
import { logoutUser } from './services/authService';

describe('App Principal - Pampulha', () => {
  beforeEach(async () => {
    localStorage.clear();
    resetEventsToDefault();
    resetNewsToDefault();
    await logoutUser();
  });

  it('renderiza o cabeçalho e exibe o Calendário de Atividades por padrão', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /nova acrópole pampulha/i })).toBeInTheDocument();
    expect(screen.getByAltText(/logotipo nova acrópole/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /calendário de atividades/i })).toBeInTheDocument();
      expect(screen.getByText(/como desenvolver a força interior/i)).toBeInTheDocument();
    });
  });

  it('permite navegar para a aba de Notícias e exibe os artigos', async () => {
    const user = userEvent.setup();
    render(<App />);

    const newsTab = screen.getByRole('button', { name: /notícias/i });
    await user.click(newsTab);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /últimas notícias e artigos/i })).toBeInTheDocument();
      expect(screen.getByText(/abre novas turmas de filosofia prática/i)).toBeInTheDocument();
    });
  });

  it('permite abrir o modal de login do Admin e autenticar com sucesso', async () => {
    const user = userEvent.setup();
    render(<App />);

    const adminBtn = screen.getByRole('button', { name: /admin/i });
    await user.click(adminBtn);

    expect(screen.getByRole('heading', { level: 2, name: /acesso administrativo/i })).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginBtn = screen.getByRole('button', { name: /entrar no painel/i });

    await user.type(emailInput, 'admin@pampulha.org');
    await user.type(passwordInput, 'admin123');
    await user.click(loginBtn);

    await waitFor(() => {
      expect(screen.getByText(/painel de gestão pampulha/i)).toBeInTheDocument();
    });
  });
});
