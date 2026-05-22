import { memo, useMemo } from 'react';

import {
  ContactDetailsHeader,
  ContactFolder,
  ContactList,
  ContactSummaryCard,
  SearchBar,
  ToggleButtonGroup,
} from '@/components/contact';
import { useCrm } from '@/context';
import type { ContactFieldsConfig } from '@/types';

interface SidebarProps {
  fieldsConfig?: ContactFieldsConfig;
}

// Composes the entire contact-details sidebar from config-driven sub-components.
// Pulls fieldsConfig from CrmContext when no prop is provided (registry-friendly).
export const Sidebar = memo(({ fieldsConfig: fieldsConfigProp }: SidebarProps = {}) => {
  const { selectedContact, activeTab, searchTerm, viewMode, fieldsConfig: ctxFieldsConfig } = useCrm();
  const fieldsConfig = fieldsConfigProp ?? ctxFieldsConfig;

  // Dynamic filter: filter both folder names and field labels by the search term.
  const filteredFolders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return fieldsConfig.folders;

    return fieldsConfig.folders
      .map((folder) => {
        const folderMatches = folder.name.toLowerCase().includes(term);
        const fields = folder.fields.filter(
          (f) =>
            f.label.toLowerCase().includes(term) || f.key.toLowerCase().includes(term),
        );
        if (folderMatches) return folder;
        if (fields.length) return { ...folder, fields };
        return null;
      })
      .filter((f): f is NonNullable<typeof f> => Boolean(f));
  }, [fieldsConfig.folders, searchTerm]);

  if (viewMode === 'list') {
    return (
      <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <ContactList />
      </div>
    );
  }

  if (!selectedContact) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-500 shadow-sm">
        Select a contact to view details.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <ContactDetailsHeader />

      <div className="mt-3 space-y-3">
        <ContactSummaryCard contact={selectedContact} />
        <ToggleButtonGroup />
        <SearchBar />
      </div>

      <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1">
        {activeTab === 'allFields' &&
          filteredFolders.map((folder) => (
            <ContactFolder
              key={folder.id}
              folder={folder}
              fields={folder.fields.filter((f) => f.visible !== false)}
              contact={selectedContact}
            />
          ))}

        {activeTab === 'dnd' && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No DND preferences configured.
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            Quick actions coming soon.
          </div>
        )}
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';
