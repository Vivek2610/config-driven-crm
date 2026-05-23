import { Check, Pencil, X } from 'lucide-react';
import { memo, useRef, useState, type KeyboardEvent } from 'react';

import type { ContactField, ContactValue } from '@/types';
import { validateContactField } from '@/utils';

interface EditableContactFieldProps {
  field: ContactField;
  value: ContactValue;
  /** Called with the new string/array value when the user saves. */
  onSave: (key: string, newValue: ContactValue) => void;
}

// Inline editable field — displays read view by default; switches to input on click.
export const EditableContactField = memo(
  ({ field, value, onSave }: EditableContactFieldProps) => {
    const displayValue =
      Array.isArray(value)
        ? value.join(', ')
        : value !== null && value !== undefined
          ? String(value)
          : '';

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(displayValue);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const startEdit = () => {
      setDraft(displayValue);
      setError(null);
      setEditing(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleSave = () => {
      const err = validateContactField(field.type, draft);
      if (err) { setError(err); return; }
      onSave(field.key, draft);
      setEditing(false);
      setError(null);
    };

    const handleCancel = () => {
      setEditing(false);
      setError(null);
      setDraft(displayValue);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && field.type !== 'address') handleSave();
      if (e.key === 'Escape') handleCancel();
    };

    const editActions = (
      <div className="flex shrink-0 items-center justify-end gap-1">
        <button
          type="button"
          onClick={handleSave}
          title="Save"
          aria-label="Save"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700"
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          title="Cancel"
          aria-label="Cancel"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    );

    return (
      <div className="group space-y-0.5">
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs text-slate-500">{field.label}</p>
          {!editing && (
            <button
              type="button"
              onClick={startEdit}
              title="Edit"
              className="invisible rounded p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 group-hover:visible"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.6} />
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-1.5">
            {field.type === 'address' ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={draft}
                rows={3}
                onChange={(e) => { setDraft(e.target.value); setError(null); }}
                onKeyDown={handleKey}
                placeholder={field.placeholder}
                className={[
                  'w-full resize-none rounded-md border px-2.5 py-1.5 text-sm text-slate-900 outline-none',
                  error ? 'border-red-400 focus:ring-1 focus:ring-red-300' : 'border-slate-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-100',
                ].join(' ')}
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                value={draft}
                onChange={(e) => { setDraft(e.target.value); setError(null); }}
                onKeyDown={handleKey}
                placeholder={field.placeholder}
                className={[
                  'w-full rounded-md border px-2.5 py-1.5 text-sm text-slate-900 outline-none',
                  error ? 'border-red-400 focus:ring-1 focus:ring-red-300' : 'border-slate-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-100',
                ].join(' ')}
              />
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}

            {editActions}
          </div>
        ) : (
          <p
            onClick={startEdit}
            title="Click to edit"
            className={[
              'cursor-pointer rounded px-0.5 py-0.5 text-sm font-medium leading-snug transition hover:bg-slate-50',
              displayValue ? 'text-slate-900' : 'italic text-slate-400',
            ].join(' ')}
          >
            {displayValue || field.placeholder || 'Not provided'}
          </p>
        )}
      </div>
    );
  },
);

EditableContactField.displayName = 'EditableContactField';
