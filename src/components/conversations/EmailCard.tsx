import { EllipsisVertical, Maximize2, Reply, Star } from 'lucide-react';
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
  const senderLabel = email.direction === 'inbound' ? contactDisplayName : email.sender.name;
  const toLabel =
    email.direction === 'outbound' && selectedContact
      ? `${selectedContact.firstName} ${selectedContact.lastName}`.trim()
      : email.to;
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
            <Maximize2 className="h-4 w-4" strokeWidth={1.8} />
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
              <p className="text-sm font-semibold text-slate-900">{senderLabel}</p>
              <p className="text-xs text-slate-500">To: {toLabel}</p>
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
              <Star
                className="h-4 w-4"
                fill={email.starred ? 'currentColor' : 'none'}
                strokeWidth={1.8}
              />
            </button>
            <button type="button" title="Reply" className="text-slate-400 hover:text-slate-700">
              <Reply className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowMenu((s) => !s)}
                title="More"
                className="rounded-md p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <EllipsisVertical className="h-4 w-4" strokeWidth={2} />
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
            <Reply className="h-3.5 w-3.5" strokeWidth={2} />
            Reply
          </button>
        </div>
      </article>

      {showPopup && <EmailPopup email={email} onClose={() => setShowPopup(false)} />}
    </>
  );
});

EmailCard.displayName = 'EmailCard';
