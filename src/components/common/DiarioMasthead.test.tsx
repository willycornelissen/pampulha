import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DiarioMasthead, formatNewspaperDate } from './DiarioMasthead';

describe('DiarioMasthead', () => {
  it('renderiza o título principal "Diário da Pampulha" e o subtítulo clássico', () => {
    render(<DiarioMasthead />);

    expect(screen.getByRole('heading', { level: 1, name: /diário da pampulha/i })).toBeInTheDocument();
    expect(screen.getByText(/a nova acrópole é uma escola de filosofia que promove a cultura e pratica o voluntariado/i)).toBeInTheDocument();
    expect(screen.getAllByText(/nova acrópole/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/bairro castelo/i)).toBeInTheDocument();
  });

  it('exibe as informações editoriais do linotipo inferior e não contém abas de alternância', () => {
    render(<DiarioMasthead />);

    expect(screen.getAllByText(/escola de filosofia/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/bairro castelo/i)).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('formata a data em português no formato clássico de cabeçalho de jornal', () => {
    const testDate = new Date(2026, 10, 8); // 8 de Novembro de 2026
    const formatted = formatNewspaperDate(testDate);

    expect(formatted).toContain('2026');
    expect(formatted.toLowerCase()).toContain('novembro');
  });
});
