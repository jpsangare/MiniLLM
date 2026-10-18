import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  size = 'md',
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg border transition-all cursor-pointer select-none ${
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs'
      } ${
        isDark
          ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700/80 hover:text-amber-200 hover:border-amber-400/40 shadow-xs'
          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-slate-300 shadow-2xs'
      } ${className}`}
      title={
        isDark
          ? 'Basculer en Mode Clair (Thème lumineux)'
          : 'Basculer en Mode Sombre (Confort visuel et réduction de la fatigue oculaire)'
      }
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      {isDark ? (
        <Sun className={`${iconSizes[size]} text-amber-400 animate-pulse`} />
      ) : (
        <Moon className={`${iconSizes[size]} text-indigo-600`} />
      )}

      {showLabel && (
        <span className="font-medium whitespace-nowrap text-xs">
          {isDark ? 'Mode Clair' : 'Mode Sombre'}
        </span>
      )}
    </button>
  );
};
