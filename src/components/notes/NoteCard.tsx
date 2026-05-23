import { memo } from 'react';

import type { Note } from '@/types';

interface NoteCardProps {
  note: Note;
}

// Returns a relative time label ("2 hours ago", "just now", etc.)
const relativeTime = (isoDate: string): string => {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

// Sticky-note style card: warm yellow-cream background with a subtle darker border.
export const NoteCard = memo(({ note }: NoteCardProps) => (
  <article
    className="rounded-lg border px-4 py-3"
    style={{ backgroundColor: '#FFFBEB', borderColor: '#F0E2B8' }}
  >
    {/* Render @mentions in blue, rest as plain text */}
    <p className="text-sm leading-relaxed text-slate-700">
      {note.body.split(/(@\w+\s\w+)/g).map((part, i) =>
        part.startsWith('@') ? (
          <span key={i} className="font-semibold text-blue-600">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
    <p className="mt-2 text-xs text-slate-400">{relativeTime(note.createdAt)}</p>
  </article>
));

NoteCard.displayName = 'NoteCard';
