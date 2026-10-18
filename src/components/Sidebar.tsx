import React from 'react';
import {
  BookOpen,
  Database,
  Layers,
  Grid,
  Sparkles,
  Sliders,
  Flame,
  FileText,
  MessageSquare,
  Code2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Compass,
  Award,
} from 'lucide-react';
import { ActiveTab } from './Header';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onReset: () => void;
  vocabSize: number;
  totalTokensCount: number;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  colorScheme?: 'indigo' | 'purple' | 'rose' | 'emerald' | 'amber';
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'DÉCOUVERTE & FONDATIONS',
    items: [
      {
        id: 'userguide',
        label: '0. Guide Découverte',
        shortLabel: 'Guide',
        icon: BookOpen,
        colorScheme: 'indigo',
      },
      {
        id: 'prerequisites',
        label: '0. Prérequis & Notions',
        shortLabel: 'Prérequis',
        icon: Compass,
        badge: '3 Clés',
        colorScheme: 'indigo',
      },
      {
        id: 'quiz',
        label: 'Grand Quiz LLM',
        shortLabel: 'Quiz',
        icon: Award,
        badge: '8 Q.',
        colorScheme: 'emerald',
      },
      {
        id: 'glossary',
        label: 'Glossaire & Lexique',
        shortLabel: 'Glossaire',
        icon: BookOpen,
        badge: 'A-Z',
        colorScheme: 'emerald',
      },
    ],
  },
  {
    title: '1. MODÈLE DE BASE',
    items: [
      {
        id: 'donnees',
        label: '1. Données & Tokens',
        shortLabel: '1. Données',
        icon: Database,
        colorScheme: 'indigo',
      },
      {
        id: 'modele',
        label: 'Mon Modèle (2D)',
        shortLabel: 'Modèle 2D',
        icon: Layers,
        colorScheme: 'indigo',
      },
      {
        id: 'matrice',
        label: '2. Poids & Matrice',
        shortLabel: '2. Poids',
        icon: Grid,
        badge: 'JSON',
        colorScheme: 'indigo',
      },
      {
        id: 'generation',
        label: '3. Inférence & Softmax',
        shortLabel: '3. Inférence',
        icon: Sparkles,
        badge: 'Gradients',
        colorScheme: 'indigo',
      },
    ],
  },
  {
    title: '2. ALIGNEMENT & RL',
    items: [
      {
        id: 'finetune',
        label: '4. Fine-Tuning (SFT)',
        shortLabel: '4. Fine-Tune',
        icon: Sliders,
        colorScheme: 'purple',
      },
      {
        id: 'rlhf',
        label: '4. Renforcement (RLHF/DPO)',
        shortLabel: '4. RLHF/DPO',
        icon: Flame,
        colorScheme: 'rose',
      },
    ],
  },
  {
    title: '3. APPLICATIONS',
    items: [
      {
        id: 'rag',
        label: '5. RAG Simple',
        shortLabel: '5. RAG',
        icon: FileText,
        colorScheme: 'emerald',
      },
      {
        id: 'chat',
        label: '5. Chatbot Multi-Moteur',
        shortLabel: '5. Chatbot',
        icon: MessageSquare,
        colorScheme: 'indigo',
      },
    ],
  },
  {
    title: '4. RESSOURCES',
    items: [
      {
        id: 'guide',
        label: 'Code & Fonctions',
        shortLabel: 'Code',
        icon: Code2,
        colorScheme: 'amber',
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  onReset,
  vocabSize,
  totalTokensCount,
}) => {
  const { t } = useLanguage();

  const handleItemClick = (id: ActiveTab) => {
    setActiveTab(id);
    setIsMobileOpen(false);
  };

  const localizedGroups: NavGroup[] = [
    {
      title: t('nav.group.discovery'),
      items: [
        {
          id: 'userguide' as ActiveTab,
          label: t('nav.userguide'),
          shortLabel: t('nav.userguide.short'),
          icon: BookOpen,
          colorScheme: 'indigo' as const,
        },
        {
          id: 'prerequisites' as ActiveTab,
          label: t('nav.prerequisites'),
          shortLabel: t('nav.prerequisites.short'),
          icon: Compass,
          badge: t('nav.prerequisites.badge'),
          colorScheme: 'indigo' as const,
        },
        {
          id: 'quiz' as ActiveTab,
          label: t('nav.quiz'),
          shortLabel: t('nav.quiz.short'),
          icon: Award,
          badge: t('nav.quiz.badge'),
          colorScheme: 'emerald' as const,
        },
        {
          id: 'glossary' as ActiveTab,
          label: t('nav.glossary'),
          shortLabel: t('nav.glossary.short'),
          icon: BookOpen,
          badge: t('nav.glossary.badge'),
          colorScheme: 'emerald' as const,
        },
      ],
    },
    {
      title: t('nav.group.base'),
      items: [
        {
          id: 'donnees' as ActiveTab,
          label: t('nav.donnees'),
          shortLabel: t('nav.donnees.short'),
          icon: Database,
          colorScheme: 'indigo' as const,
        },
        {
          id: 'modele' as ActiveTab,
          label: t('nav.modele'),
          shortLabel: t('nav.modele.short'),
          icon: Layers,
          colorScheme: 'indigo' as const,
        },
        {
          id: 'matrice' as ActiveTab,
          label: t('nav.matrice'),
          shortLabel: t('nav.matrice.short'),
          icon: Grid,
          badge: 'JSON',
          colorScheme: 'indigo' as const,
        },
        {
          id: 'generation' as ActiveTab,
          label: t('nav.generation'),
          shortLabel: t('nav.generation.short'),
          icon: Sparkles,
          badge: 'Gradients',
          colorScheme: 'indigo' as const,
        },
      ],
    },
    {
      title: t('nav.group.alignment'),
      items: [
        {
          id: 'finetune' as ActiveTab,
          label: t('nav.finetune'),
          shortLabel: t('nav.finetune.short'),
          icon: Sliders,
          colorScheme: 'purple' as const,
        },
        {
          id: 'rlhf' as ActiveTab,
          label: t('nav.rlhf'),
          shortLabel: t('nav.rlhf.short'),
          icon: Flame,
          colorScheme: 'rose' as const,
        },
      ],
    },
    {
      title: t('nav.group.apps'),
      items: [
        {
          id: 'rag' as ActiveTab,
          label: t('nav.rag'),
          shortLabel: t('nav.rag.short'),
          icon: FileText,
          colorScheme: 'emerald' as const,
        },
        {
          id: 'chat' as ActiveTab,
          label: t('nav.chat'),
          shortLabel: t('nav.chat.short'),
          icon: MessageSquare,
          colorScheme: 'indigo' as const,
        },
      ],
    },
    {
      title: t('nav.group.resources') || t('nav.group.docs'),
      items: [
        {
          id: 'guide' as ActiveTab,
          label: t('nav.guide'),
          shortLabel: t('nav.guide.short'),
          icon: Code2,
          colorScheme: 'amber' as const,
        },
      ],
    },
  ];

  const getItemStyles = (item: NavItem, isActive: boolean) => {
    if (!isActive) {
      return 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80';
    }

    switch (item.colorScheme) {
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold border-l-3 border-purple-600 dark:border-purple-400 shadow-xs';
      case 'rose':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold border-l-3 border-rose-600 dark:border-rose-400 shadow-xs';
      case 'emerald':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border-l-3 border-emerald-600 dark:border-emerald-400 shadow-xs';
      case 'amber':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold border-l-3 border-amber-600 dark:border-amber-400 shadow-xs';
      default:
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border-l-3 border-indigo-600 dark:border-indigo-400 shadow-xs';
    }
  };

  const getBadgeStyles = (item: NavItem, isActive: boolean) => {
    if (isActive) {
      switch (item.colorScheme) {
        case 'purple':
          return 'bg-purple-200/80 dark:bg-purple-900/80 text-purple-800 dark:text-purple-200';
        case 'rose':
          return 'bg-rose-200/80 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200';
        case 'emerald':
          return 'bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200';
        case 'amber':
          return 'bg-amber-200/80 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200';
        default:
          return 'bg-indigo-200/80 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200';
      }
    }
    return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700';
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 lg:static
          h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col
          transition-all duration-300 ease-in-out select-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-[72px] w-[260px]' : 'w-[270px]'}
        `}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div
            className={`flex items-center gap-3 overflow-hidden cursor-pointer ${
              isCollapsed ? 'lg:justify-center lg:w-full' : ''
            }`}
            onClick={() => setActiveTab('userguide')}
            title="MiniLLM Studio - Revenir au guide"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="font-mono font-bold text-base leading-none">M</span>
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                  MiniLLM Studio
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Simulateur visuel
                </div>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle (header button) */}
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="hidden lg:flex p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isCollapsed ? 'Développer la barre latérale' : 'Réduire la barre latérale'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {localizedGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {(!isCollapsed || isMobileOpen) && (
                <div className="px-3 pt-1 pb-1 text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  {group.title}
                </div>
              )}
              {isCollapsed && !isMobileOpen && groupIdx > 0 && (
                <div className="mx-2 my-1 border-t border-slate-100 dark:border-slate-800" />
              )}

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      title={`${item.label} ${item.badge ? `(${item.badge})` : ''}`}
                      className={`
                        w-full group flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer
                        ${getItemStyles(item, isActive)}
                        ${isCollapsed && !isMobileOpen ? 'justify-center px-2 py-2.5' : ''}
                      `}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-current'
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        }`}
                      />

                      {(!isCollapsed || isMobileOpen) && (
                        <div className="flex-1 flex items-center justify-between gap-1 min-w-0">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[9px] uppercase px-1.5 py-0.5 font-bold tracking-wider rounded-md shrink-0 ${getBadgeStyles(
                                item,
                                isActive
                              )}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 shrink-0">
          {(!isCollapsed || isMobileOpen) ? (
            <>
              {/* Quick statistics */}
              <div className="px-2.5 py-2 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500 dark:text-slate-400">{t('header.vocab')} :</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-100">
                    {vocabSize} {t('header.words')}
                  </span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500 dark:text-slate-400">{t('header.corpus')} :</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-100">
                    {totalTokensCount} {t('header.tokens')}
                  </span>
                </div>
              </div>

              {/* Theme Toggle Button */}
              <div className="pt-0.5">
                <ThemeToggle showLabel className="w-full justify-start" />
              </div>

              {/* Reset action */}
              <button
                onClick={onReset}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                title={t('header.resetTooltip')}
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{t('header.reset')}</span>
              </button>

              {/* Bottom collapse button */}
              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden lg:flex w-full items-center justify-center gap-1.5 py-1.5 text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{t('header.collapse')}</span>
              </button>
            </>
          ) : (
            <>
              {/* Collapsed actions */}
              <div className="flex flex-col gap-2">
                <ThemeToggle className="w-full" />

                <button
                  onClick={onReset}
                  className="w-full flex items-center justify-center p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                  title={t('header.resetTooltip')}
                >
                  <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>

                <button
                  onClick={() => setIsCollapsed(false)}
                  className="hidden lg:flex w-full items-center justify-center p-2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title={t('header.expandSidebar')}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};
