import { FileText, MessageCircle, Settings, User } from 'lucide-react';
import { memo, type ReactNode } from 'react';

import { useUiLayout } from '@/context';

const iconClass = 'h-5 w-5';
const iconStroke = 1.6;

interface NavTab {
  id: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  active?: boolean;
}

const ContactsIcon = <User className={iconClass} strokeWidth={iconStroke} />;
const ConversationsIcon = <MessageCircle className={iconClass} strokeWidth={iconStroke} />;
const NotesIcon = <FileText className={iconClass} strokeWidth={iconStroke} />;
const SettingsIcon = <Settings className={iconClass} strokeWidth={iconStroke} />;

// Fixed bottom navigation for mobile. Tabs map to page sections + notes drawer
// + a settings placeholder so it matches the desktop NavBar set.
export const MobileBottomNav = memo(() => {
  const { mobileSection, setMobileSection, notesOpen, toggleNotes } = useUiLayout();

  const tabs: NavTab[] = [
    {
      id: 'sidebar',
      label: 'Contacts',
      icon: ContactsIcon,
      active: mobileSection === 'sidebar' && !notesOpen,
      onClick: () => {
        setMobileSection('sidebar');
      },
    },
    {
      id: 'main',
      label: 'Chat',
      icon: ConversationsIcon,
      active: mobileSection === 'main' && !notesOpen,
      onClick: () => {
        setMobileSection('main');
      },
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: NotesIcon,
      active: notesOpen,
      onClick: toggleNotes,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      active: false,
    },
  ];

  return (
    <nav
      className="shrink-0 border-t border-slate-200 bg-white"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary mobile navigation"
    >
      <ul className="flex items-stretch justify-around">
        {tabs.map((tab) => (
          <li key={tab.id} className="flex-1">
            <button
              type="button"
              onClick={tab.onClick}
              aria-pressed={tab.active}
              aria-label={tab.label}
              className={[
                'flex w-full flex-col items-center justify-center gap-0.5 px-2 py-2 transition-colors',
                tab.active
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-700',
                !tab.onClick ? 'cursor-default opacity-60' : '',
              ].join(' ')}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
});

MobileBottomNav.displayName = 'MobileBottomNav';
