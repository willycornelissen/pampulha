import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renderiza com papel switch, nome acessível estável e estado dark ativado', () => {
    const handleToggle = vi.fn();
    render(<ThemeToggle theme="dark" onToggle={handleToggle} />);

    const switchBtn = screen.getByRole('switch', { name: /modo escuro/i });
    expect(switchBtn).toBeInTheDocument();
    expect(switchBtn).toHaveAttribute('aria-checked', 'true');
    expect(switchBtn).toHaveAttribute('title', 'Alternar para modo claro');
  });

  it('renderiza com papel switch, nome acessível estável e estado light desativado', () => {
    const handleToggle = vi.fn();
    render(<ThemeToggle theme="light" onToggle={handleToggle} />);

    const switchBtn = screen.getByRole('switch', { name: /modo escuro/i });
    expect(switchBtn).toBeInTheDocument();
    expect(switchBtn).toHaveAttribute('aria-checked', 'false');
    expect(switchBtn).toHaveAttribute('title', 'Alternar para modo escuro');
  });

  it('dispara onToggle ao ser clicado', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();

    render(<ThemeToggle theme="dark" onToggle={handleToggle} />);

    const switchBtn = screen.getByRole('switch', { name: /modo escuro/i });
    await user.click(switchBtn);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('permite interação via teclado (Space/Enter)', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();

    render(<ThemeToggle theme="light" onToggle={handleToggle} />);

    const switchBtn = screen.getByRole('switch', { name: /modo escuro/i });
    switchBtn.focus();
    expect(switchBtn).toHaveFocus();

    await user.keyboard(' ');
    expect(handleToggle).toHaveBeenCalledTimes(1);

    await user.keyboard('{Enter}');
    expect(handleToggle).toHaveBeenCalledTimes(2);
  });
});
