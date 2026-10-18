import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  showIcon = true,
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-800/80 shadow-2xs ${className}`}
      role="group"
      aria-label="Sélecteur de langue / Language selector"
    >
      {showIcon && (
        <span className="hidden sm:flex items-center pl-1.5 pr-0.5 text-slate-400 dark:text-slate-500">
          <Globe className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      )}

      {/* French Option */}
      <button
        type="button"
        onClick={() => setLanguage('fr')}
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
          language === 'fr'
            ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs border border-slate-200/80 dark:border-slate-700'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
        aria-pressed={language === 'fr'}
        title="Passer l'interface en Français"
      >
        <span className="text-[12px] leading-none" role="img" aria-label="France">🇫🇷</span>
        <span className="text-[11px] uppercase tracking-wider font-bold">FR</span>
      </button>

      {/* English Option */}
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs border border-slate-200/80 dark:border-slate-700'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
        aria-pressed={language === 'en'}
        title="Switch interface to English"
      >
        <span className="text-[12px] leading-none" role="img" aria-label="United Kingdom">🇬🇧</span>
        <span className="text-[11px] uppercase tracking-wider font-bold">EN</span>
      </button>
    </div>
  );
};
