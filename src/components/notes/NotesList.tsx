import { memo } from 'react';

import type { Note } from '@/types';

import { NoteCard } from './NoteCard';

interface NotesListProps {
  notes: Note[];
}

// Scrollable stack of note cards.
export const NotesList = memo(({ notes }: NotesListProps) => {
  if (!notes.length) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
        No notes yet. Click <strong>+ Add</strong> to create one.
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
});

NotesList.displayName = 'NotesList';
