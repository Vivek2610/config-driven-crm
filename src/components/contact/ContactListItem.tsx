import { memo } from 'react';

import type { ContactRecord } from '@/types';
import { getAvatarHue, getInitials } from '@/utils';

interface ContactListItemProps {
  contact: ContactRecord;
  selected: boolean;
  onSelect: (id: number) => void;
}

// Compact row used inside ContactList.
export const ContactListItem = memo(({ contact, selected, onSelect }: ContactListItemProps) => {
  const fullName = `${contact.firstName} ${contact.lastName}`.trim();
  const hue = getAvatarHue(fullName);

  return (
    <button
      type="button"
      onClick={() => onSelect(contact.id)}
      className={[
        'flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition',
        selected
          ? 'border-blue-200 bg-blue-50'
          : 'border-transparent hover:border-slate-200 hover:bg-slate-50',
      ].join(' ')}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
        style={{ backgroundColor: `hsl(${hue} 55% 50%)` }}
      >
        {getInitials(fullName)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{fullName}</p>
        <p className="truncate text-xs text-slate-500">{contact.email ?? contact.phone ?? '—'}</p>
      </div>
    </button>
  );
});

ContactListItem.displayName = 'ContactListItem';
