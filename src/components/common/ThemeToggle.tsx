import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Theme } from '../../hooks/useTheme';

export interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  className = '',
}) => {
  const isDark = theme === 'dark';
  const accessibleLabel = 'Modo escuro';
  const actionTooltip = isDark ? 'Alternar para modo claro' : 'Alternar para modo escuro';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={accessibleLabel}
      title={actionTooltip}
      onClick={onToggle}
      className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f39300] focus-visible:ring-offset-2 ${
        isDark
          ? 'bg-black/40 border border-white/20 hover:border-white/40'
          : 'bg-black/20 border border-white/20 hover:border-white/40'
      } ${className}`}
    >
      {/* Ícones de fundo estáticos na trilha */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun className="w-3.5 h-3.5 text-[#f39300]" aria-hidden="true" />
        <Moon className="w-3.5 h-3.5 text-white/70" aria-hidden="true" />
      </div>

      {/* Alavanca deslizante (thumb) da chave */}
      <span
        aria-hidden="true"
        className={`pointer-events-none relative z-10 flex h-6 w-6 transform items-center justify-center rounded-full shadow-md transition-transform duration-200 ease-in-out ${
          isDark
            ? 'translate-x-6 bg-[#009485] text-white'
            : 'translate-x-0 bg-white text-[#f39300]'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-white" aria-hidden="true" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-[#f39300]" aria-hidden="true" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
