import { memo, useState } from 'react';

import { useCrm } from '@/context';
import type {
  ContactField as ContactFieldModel,
  ContactFolder as ContactFolderModel,
  ContactRecord,
  ContactValue,
} from '@/types';

import { EditableContactField } from './EditableContactField';

interface ContactFolderProps {
  folder: ContactFolderModel;
  fields: ContactFieldModel[];
  contact: ContactRecord;
}

// Collapsible folder card with per-folder edit mode and field-level inline editing.
export const ContactFolder = memo(({ folder, fields, contact }: ContactFolderProps) => {
  const { openFolders, toggleFolder, updateContact } = useCrm();
  const isOpen = openFolders[folder.id] ?? folder.defaultOpen ?? true;

  // Pending edits for this folder — committed to context only on Save.
  const [pendingEdits, setPendingEdits] = useState<Record<string, ContactValue>>({});
  const [editing, setEditing] = useState(false);

  if (!fields.length) return null;

  const handleFieldSave = (key: string, newValue: ContactValue) => {
    setPendingEdits((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleFolderSave = () => {
    if (Object.keys(pendingEdits).length) {
      updateContact(pendingEdits as Partial<ContactRecord>);
    }
    setPendingEdits({});
    setEditing(false);
  };

  const handleFolderCancel = () => {
    setPendingEdits({});
    setEditing(false);
  };

  // When reading a field value, prefer the local pending edit over the saved value.
  const getFieldValue = (key: string): ContactValue =>
    key in pendingEdits
      ? pendingEdits[key]
      : (contact[key] as ContactValue) ?? null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between px-3.5 py-2.5">
        <h3 className="text-sm font-semibold text-slate-900">{folder.name}</h3>
        <div className="flex items-center gap-0.5">
          {!editing ? (
            <>
              {/* Add — icon only, shown when folder is addable */}
              {folder.addable && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  title={`Add to ${folder.name}`}
                  aria-label={`Add to ${folder.name}`}
                  className="rounded-md p-1 text-blue-600 transition hover:bg-blue-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              )}

              {/* Edit — pencil icon only */}
              <button
                type="button"
                onClick={() => setEditing(true)}
                title="Edit fields"
                aria-label="Edit fields"
                className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleFolderSave}
                className="rounded-md bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleFolderCancel}
                className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </>
          )}

          {/* Collapse toggle */}
          {(folder.collapsible ?? true) && (
            <button
              type="button"
              onClick={() => toggleFolder(folder.id)}
              className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label={isOpen ? 'Collapse' : 'Expand'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className={['h-4 w-4 transition-transform duration-200', isOpen ? '' : '-rotate-90'].join(' ')}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <div
        className={[
          'grid overflow-hidden transition-all duration-200 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        ].join(' ')}
      >
        <div className="min-h-0">
          <div className="space-y-3 border-t border-slate-100 px-3.5 py-3">
            {fields.map((field) =>
              editing ? (
                <EditableContactField
                  key={field.key}
                  field={field}
                  value={getFieldValue(field.key)}
                  onSave={handleFieldSave}
                />
              ) : (
                // Read-only view
                <div key={field.key} className="space-y-0.5">
                  <p className="text-xs text-slate-500">{field.label}</p>
                  <p className="text-sm font-medium text-slate-900">
                    {(() => {
                      const val = getFieldValue(field.key);
                      if (Array.isArray(val)) return val.join(', ') || '—';
                      return val !== null && val !== undefined && val !== '' ? String(val) : '—';
                    })()}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

ContactFolder.displayName = 'ContactFolder';
