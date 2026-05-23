import {
  Calendar,
  FileCheck,
  FileText,
  History,
  Network,
} from 'lucide-react';
import { memo } from 'react';

import { useUiLayout } from '@/context';

const iconClass = 'h-5 w-5';
const iconStroke = 1.6;

const tooltipClass =
  'pointer-events-none absolute right-full top-1/2 z-10 mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100';

// Thin icon-only right navigation rail with 5 items.
// Pulls notes-toggle state from UiLayoutContext so the rail can drop into any
// layout without prop drilling.
export const NavBar = memo(() => {
  const { notesOpen, toggleNotes } = useUiLayout();
  const onToggleNotes = toggleNotes;
  const navItems = [
    {
      id: 'history',
      label: 'History',
      active: false,
      onClick: undefined,
      icon: <History className={iconClass} strokeWidth={iconStroke} />,
    },
    {
      id: 'network',
      label: 'Network',
      active: false,
      onClick: undefined,
      icon: <Network className={iconClass} strokeWidth={iconStroke} />,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      active: false,
      onClick: undefined,
      icon: <FileCheck className={iconClass} strokeWidth={iconStroke} />,
    },
    {
      id: 'notes',
      label: 'Notes',
      active: notesOpen,
      onClick: onToggleNotes,
      icon: <FileText className={iconClass} strokeWidth={iconStroke} />,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      active: false,
      onClick: undefined,
      icon: <Calendar className={iconClass} strokeWidth={iconStroke} />,
    },
  ];

  return (
    <nav className="flex h-full w-14 shrink-0 flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white py-3 shadow-sm">
      <div className="flex flex-col items-center gap-1">
        {navItems.map((item) => (
          <div key={item.id} className="group relative">
            <button
              onClick={item.onClick}
              aria-label={item.label}
              type="button"
              className={[
                'flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-150',
                item.active
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
                item.onClick ? 'cursor-pointer' : 'cursor-default',
              ].join(' ')}
            >
              {item.icon}
            </button>
            <span role="tooltip" className={tooltipClass}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </nav>
  );
});

NavBar.displayName = 'NavBar';
