import { memo } from 'react';

import { useCrm } from '@/context';
import type { ContactTab } from '@/types';

const tabs: { id: ContactTab; label: string }[] = [
  { id: 'allFields', label: 'All Fields' },
  { id: 'dnd', label: 'DND' },
  { id: 'actions', label: 'Actions' },
];

// Segmented control for switching sidebar tabs.
export const ToggleButtonGroup = memo(() => {
  const { activeTab, setActiveTab } = useCrm();

  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={[
              'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
              active
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900',
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
});

ToggleButtonGroup.displayName = 'ToggleButtonGroup';
