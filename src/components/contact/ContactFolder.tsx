import { memo } from 'react';

import { useCrm } from '@/context';
import type {
  ContactField as ContactFieldModel,
  ContactFolder as ContactFolderModel,
  ContactRecord,
  ContactValue,
} from '@/types';

import { ContactField } from './ContactField';

interface ContactFolderProps {
  folder: ContactFolderModel;
  fields: ContactFieldModel[];
  contact: ContactRecord;
}

// Collapsible folder card. Header has title, optional + Add, and chevron.
// Open/closed state lives in CrmContext (keyed by folder id).
export const ContactFolder = memo(({ folder, fields, contact }: ContactFolderProps) => {
  const { openFolders, toggleFolder } = useCrm();
  const isOpen = openFolders[folder.id] ?? folder.defaultOpen ?? true;

  if (!fields.length) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between px-3.5 py-2.5">
        <h3 className="text-sm font-semibold text-slate-900">{folder.name}</h3>
        <div className="flex items-center gap-1">
          {folder.addable && (
            <button
              type="button"
              title={`Add to ${folder.name}`}
              className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add
            </button>
          )}
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
                className={[
                  'h-4 w-4 transition-transform duration-200',
                  isOpen ? '' : '-rotate-90',
                ].join(' ')}
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
            {fields.map((field) => (
              <ContactField
                key={field.key}
                field={field}
                value={(contact[field.key] as ContactValue) ?? null}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

ContactFolder.displayName = 'ContactFolder';
