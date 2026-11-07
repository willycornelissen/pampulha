import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
  it('renderiza o cabeçalho e título do projeto Pampulha', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /pampulha/i })).toBeInTheDocument();
    expect(screen.getByText(/fase 0 concluída/i)).toBeInTheDocument();
  });

  it('permite alternar entre as abas e exibe os conteúdos respectivos', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Por padrão a aba 'Visão Geral' está ativa
    expect(screen.getByText(/vite \+ react 19/i)).toBeInTheDocument();

    // Clica na aba 'Stack & Ferramentas'
    const archTab = screen.getByRole('button', { name: /stack & ferramentas/i });
    await user.click(archTab);

    expect(screen.getByRole('heading', { level: 3, name: /configuração técnica/i })).toBeInTheDocument();
    expect(screen.getByText(/bundler & dev server/i)).toBeInTheDocument();

    // Clica na aba 'Próximos Passos'
    const stepsTab = screen.getByRole('button', { name: /próximos passos/i });
    await user.click(stepsTab);

    expect(screen.getByText(/roteiro de desenvolvimento/i)).toBeInTheDocument();
    expect(screen.getByText(/fase 1: discovery & prd lean/i)).toBeInTheDocument();
  });
});
