import { memo, useRef, useState } from 'react';

import { NotesList } from '@/components/notes';
import { useCrm } from '@/context';

interface NotesPanelProps {
  onClose: () => void;
}

// Right-side notes panel with add, close, and sticky-card display.
export const NotesPanel = memo(({ onClose }: NotesPanelProps) => {
  const { selectedContactNotes: notes, addNote } = useCrm();
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const openCompose = () => {
    setComposing(true);
    // Let the textarea render, then focus it
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleSave = () => {
    if (!draft.trim()) return;
    addNote(draft);
    setDraft('');
    setComposing(false);
  };

  const handleCancel = () => {
    setDraft('');
    setComposing(false);
  };

  return (
    <aside className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Panel header */}
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">Notes</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCompose}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            title="Add note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            title="Close notes panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Compose area */}
      {composing && (
        <div className="shrink-0 border-b border-slate-200 p-3">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a note…"
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-200 p-2.5 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            style={{ backgroundColor: '#FFFBEB' }}
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!draft.trim()}
              className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save note
            </button>
          </div>
        </div>
      )}

      {/* Scrollable note cards */}
      <div className="flex-1 overflow-y-auto p-3">
        <NotesList notes={notes} />
      </div>
    </aside>
  );
});

NotesPanel.displayName = 'NotesPanel';
