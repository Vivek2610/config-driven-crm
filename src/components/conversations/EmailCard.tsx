import { memo, useEffect, useRef, useState } from 'react';

import { useCrm } from '@/context';
import type { EmailConversation } from '@/types';
import { formatRelativeTime, getAvatarHue, getInitials } from '@/utils';

import { EmailPopup } from './EmailPopup';

interface EmailCardProps {
  email: EmailConversation;
}

// Email card: truncated subject, expand button, optional thread badge, 3-dot menu.
export const EmailCard = memo(({ email }: EmailCardProps) => {
  const { selectedContact, toggleConversationStar } = useCrm();
  const [showPopup, setShowPopup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close 3-dot dropdown when clicking outside.
  useEffect(() => {
    if (!showMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  const contactDisplayName = selectedContact
    ? `${selectedContact.firstName} ${selectedContact.lastName}`.trim()
    : email.sender.name;
  const avatarName = email.direction === 'inbound' ? contactDisplayName : email.sender.name;
  const hue = getAvatarHue(avatarName);

  return (
    <>
      <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Subject row */}
        <header className="flex items-start justify-between gap-2 border-b border-slate-100 px-4 py-3">
          <h4 className="flex-1 truncate text-sm font-semibold text-slate-900" title={email.subject}>
            {email.subject}
          </h4>
          <button
            type="button"
            onClick={() => setShowPopup(true)}
            title="Expand email"
            className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </button>
        </header>

        {/* Thread count badge (centered, only when > 1) */}
        {email.threadCount && email.threadCount > 1 && (
          <div className="relative -mt-px flex justify-center">
            <span className="-mt-3 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-semibold text-slate-500">
              {email.threadCount}
            </span>
          </div>
        )}

        {/* Sender row */}
        <div className="flex items-start justify-between gap-3 px-4 pt-2">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: `hsl(${hue} 55% 50%)` }}
            >
              {getInitials(avatarName)}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{email.sender.name}</p>
              <p className="text-xs text-slate-500">To: {email.to}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{formatRelativeTime(email.createdAt)}</span>
            <button
              type="button"
              onClick={() => toggleConversationStar(email.id)}
              title={email.starred ? 'Starred' : 'Star'}
              className={email.starred ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.32.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .32-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            </button>
            <button type="button" title="Reply" className="text-slate-400 hover:text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
            </button>
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowMenu((s) => !s)}
                title="More"
                className="rounded-md p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
              </button>
              {showMenu && (
                <ul className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg">
                  {['Forward', 'Mark as unread', 'Archive', 'Delete'].map((opt) => (
                    <li key={opt}>
                      <button
                        type="button"
                        onClick={() => setShowMenu(false)}
                        className="block w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50"
                      >
                        {opt}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-3 px-4 py-3">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{email.body}</p>

          {email.trackUrl && (
            <a
              href={email.trackUrl}
              className="block text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Track Your Order
            </a>
          )}

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
            Reply
          </button>
        </div>
      </article>

      {showPopup && <EmailPopup email={email} onClose={() => setShowPopup(false)} />}
    </>
  );
});

EmailCard.displayName = 'EmailCard';
