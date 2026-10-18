import React from 'react';
import {
  Menu,
  RotateCcw,
  PanelLeft,
  ChevronRight,
  Database,
  Layers,
  Grid,
  Sparkles,
  Sliders,
  Flame,
  FileText,
  MessageSquare,
  Code2,
  BookOpen,
  Award,
  Compass,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { CompactProgressPill } from './ProgressIndicator';

export type ActiveTab =
  | 'userguide'
  | 'prerequisites'
  | 'glossary'
  | 'quiz'
  | 'donnees'
  | 'modele'
  | 'matrice'
  | 'generation'
  | 'finetune'
  | 'rlhf'
  | 'rag'
  | 'chat'
  | 'guide';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onReset: () => void;
  vocabSize: number;
  totalTokensCount: number;
  onToggleSidebar?: () => void;
  onOpenMobileSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  completedStepNumbers?: number[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onReset,
  vocabSize,
  totalTokensCount,
  onToggleSidebar,
  onOpenMobileSidebar,
  isSidebarCollapsed = false,
  completedStepNumbers = [],
}) => {
  const { t } = useLanguage();

  // Map active tab to breadcrumb information
  const getTabInfo = () => {
    switch (activeTab) {
      case 'userguide':
        return {
          section: t('section.discovery'),
          title: t('tab.userguide'),
          icon: BookOpen,
          badgeColor: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        };
      case 'prerequisites':
        return {
          section: t('section.discovery'),
          title: t('tab.prerequisites'),
          icon: Compass,
          badgeColor: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        };
      case 'glossary':
        return {
          section: t('section.discovery'),
          title: t('tab.glossary'),
          icon: BookOpen,
          badgeColor: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        };
      case 'quiz':
        return {
          section: t('section.assessment'),
          title: t('tab.quiz'),
          icon: Award,
          badgeColor: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        };
      case 'donnees':
        return {
          section: t('section.baseModel'),
          title: t('tab.donnees'),
          icon: Database,
          badgeColor: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        };
      case 'modele':
        return {
          section: t('section.baseModel'),
          title: t('tab.modele'),
          icon: Layers,
          badgeColor: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        };
      case 'matrice':
        return {
          section: t('section.baseModel'),
          title: t('tab.matrice'),
          icon: Grid,
          badgeColor: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        };
      case 'generation':
        return {
          section: t('section.baseModel'),
          title: t('tab.generation'),
          icon: Sparkles,
          badgeColor: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        };
      case 'finetune':
        return {
          section: t('section.alignment'),
          title: t('tab.finetune'),
          icon: Sliders,
          badgeColor: 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        };
      case 'rlhf':
        return {
          section: t('section.alignment'),
          title: t('tab.rlhf'),
          icon: Flame,
          badgeColor: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        };
      case 'rag':
        return {
          section: t('section.apps'),
          title: t('tab.rag'),
          icon: FileText,
          badgeColor: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        };
      case 'chat':
        return {
          section: t('section.apps'),
          title: t('tab.chat'),
          icon: MessageSquare,
          badgeColor: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        };
      case 'guide':
        return {
          section: t('section.docs'),
          title: t('tab.guide'),
          icon: Code2,
          badgeColor: 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        };
      default:
        return {
          section: 'Module',
          title: t('app.title'),
          icon: BookOpen,
          badgeColor: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        };
    }
  };

  const current = getTabInfo();
  const CurrentIcon = current.icon;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-2xs transition-colors duration-200">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Desktop sidebar toggle + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={t('header.openMenu')}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop sidebar toggle button */}
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex items-center gap-1.5 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isSidebarCollapsed ? t('header.expandSidebar') : t('header.collapseSidebar')}
          >
            <PanelLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden xl:inline">
              {isSidebarCollapsed ? t('header.expand') : t('header.collapse')}
            </span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Breadcrumb / Title of active page */}
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <span className="hidden md:inline-flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
              {current.section}
              <ChevronRight className="w-3.5 h-3.5 mx-1 text-slate-400 shrink-0" />
            </span>
            <div className="flex items-center gap-2 truncate">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border truncate ${current.badgeColor}`}
              >
                <CurrentIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{current.title}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick stats, Language Selector, Theme & Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Progress Pill */}
          <div className="hidden md:block">
            <CompactProgressPill
              completedCount={completedStepNumbers.length}
              onClick={() => setActiveTab('userguide')}
            />
          </div>

          {/* Stats pills (desktop) */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-md border border-slate-200 dark:border-slate-700">
              {t('header.vocab')} : <strong className="text-slate-900 dark:text-slate-100 font-mono">{vocabSize}</strong> {t('header.words')}
            </span>
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-md border border-slate-200 dark:border-slate-700">
              {t('header.corpus')} : <strong className="text-slate-900 dark:text-slate-100 font-mono">{totalTokensCount}</strong> {t('header.tokens')}
            </span>
          </div>

          {/* Language Selector (FR / EN) in top bar */}
          <LanguageSelector />

          {/* Theme Toggle Button */}
          <ThemeToggle size="sm" />

          {/* Code link button */}
          <button
            onClick={() => setActiveTab('guide')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={t('header.codeTooltip')}
          >
            <Code2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">{t('header.code')}</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
            title={t('header.resetTooltip')}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">{t('header.reset')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
