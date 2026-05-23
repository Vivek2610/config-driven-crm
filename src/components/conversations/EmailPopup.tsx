import { Reply, X } from 'lucide-react';
import { memo, useEffect } from 'react';

import { useCrm } from '@/context';
import type { EmailConversation } from '@/types';
import { formatRelativeTime, getAvatarHue, getInitials } from '@/utils';

interface EmailPopupProps {
  email: EmailConversation;
  onClose: () => void;
}

// Full-screen modal showing the complete email content.
export const EmailPopup = memo(({ email, onClose }: EmailPopupProps) => {
  const { selectedContact } = useCrm();
  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const contactDisplayName = selectedContact
    ? `${selectedContact.firstName} ${selectedContact.lastName}`.trim()
    : email.sender.name;
  const avatarName = email.direction === 'inbound' ? contactDisplayName : email.sender.name;
  const hue = getAvatarHue(avatarName);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-3">
          <h3 className="min-w-0 flex-1 break-words text-base font-semibold leading-snug text-slate-900">
            {email.subject}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            title="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </header>

        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: `hsl(${hue} 55% 50%)` }}
          >
            {getInitials(avatarName)}
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">{email.sender.name}</p>
            <p className="text-xs text-slate-500">To: {email.to}</p>
          </div>
          <span className="text-xs text-slate-500">{formatRelativeTime(email.createdAt)}</span>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{email.body}</p>
          {email.trackUrl && (
            <a
              href={email.trackUrl}
              className="block text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Track Your Order
            </a>
          )}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <Reply className="h-3.5 w-3.5" strokeWidth={2} />
            Reply
          </button>
        </footer>
      </div>
    </div>
  );
});

EmailPopup.displayName = 'EmailPopup';
