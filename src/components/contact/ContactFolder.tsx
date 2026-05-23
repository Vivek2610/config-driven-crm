import { ChevronUp, Pencil, Plus } from 'lucide-react';
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
                  <Plus className="h-4 w-4" strokeWidth={2} />
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
                <Pencil className="h-4 w-4" strokeWidth={1.6} />
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
              <ChevronUp
                className={['h-4 w-4 transition-transform duration-200', isOpen ? '' : '-rotate-90'].join(' ')}
                strokeWidth={1.8}
              />
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
