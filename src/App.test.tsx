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
    expect(screen.getByRole('heading', { level: 1, name: /diário da pampulha/i })).toBeInTheDocument();
    expect(screen.queryByAltText(/logotipo nova acrópole/i)).not.toBeInTheDocument();

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
      expect(screen.getByRole('heading', { level: 2, name: /últimas notícias/i })).toBeInTheDocument();
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

  it('permite alternar entre os modos claro e escuro através da chave na tela principal', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Por padrão, inicia no modo escuro (aria-checked="true")
    const themeSwitch = screen.getByRole('switch', { name: /modo escuro/i });
    expect(themeSwitch).toBeInTheDocument();
    expect(themeSwitch).toHaveAttribute('aria-checked', 'true');
    expect(themeSwitch).toHaveAttribute('title', 'Alternar para modo claro');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Clica na chave para mudar para o modo claro
    await user.click(themeSwitch);

    expect(themeSwitch).toHaveAttribute('aria-checked', 'false');
    expect(themeSwitch).toHaveAttribute('title', 'Alternar para modo escuro');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('pampulha_theme')).toBe('light');

    // Clica novamente para voltar ao modo escuro
    await user.click(themeSwitch);

    expect(themeSwitch).toHaveAttribute('aria-checked', 'true');
    expect(themeSwitch).toHaveAttribute('title', 'Alternar para modo claro');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('pampulha_theme')).toBe('dark');
  });

  it('permite alternar entre Calendário e Notícias através da navegação principal', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /diário da pampulha/i })).toBeInTheDocument();

    const newsNavBtn = screen.getByRole('button', { name: /notícias/i });
    await user.click(newsNavBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /últimas notícias/i })).toBeInTheDocument();
    });

    const calendarNavBtn = screen.getByRole('button', { name: /calendário/i });
    await user.click(calendarNavBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /calendário de atividades/i })).toBeInTheDocument();
    });
  });
});
