import { memo, useEffect, useMemo, useState } from 'react';

import { MainPanel, NotesPanel, Sidebar } from '@/components';
import { CrmProvider, useCrm } from '@/context';
import { crmApi } from '@/services';
import type { ContactDataConfig, ContactFieldsConfig } from '@/types';

interface CrmBootstrapData {
  fields: ContactFieldsConfig;
  contactData: ContactDataConfig;
}

interface ContactDetailsPageProps {
  notesOpen: boolean;
  onCloseNotes: () => void;
}

// Inner layout shell — rendered inside CrmProvider so it can consume context.
const CrmWorkspace = memo(
  ({
    fieldsConfig,
    notesOpen,
    onCloseNotes,
  }: {
    fieldsConfig: ContactFieldsConfig;
    notesOpen: boolean;
    onCloseNotes: () => void;
  }) => {
    const { selectedContact } = useCrm();

    return (
      <div className="flex flex-1 gap-5 overflow-hidden">
        {/* Left: Contact details sidebar */}
        <aside className="hidden w-80 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex md:flex-col">
          <Sidebar fieldsConfig={fieldsConfig} />
        </aside>

        {/* Center: Conversations — expands when Notes is closed */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {selectedContact ? (
            <MainPanel />
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-500 shadow-sm">
              No contact selected.
            </div>
          )}
        </div>

        {/* Right: Notes panel — shows notes for the selected contact only */}
        {notesOpen && (
          <aside className="hidden w-72 shrink-0 overflow-hidden lg:flex lg:flex-col">
            <NotesPanel onClose={onCloseNotes} />
          </aside>
        )}
      </div>
    );
  },
);
CrmWorkspace.displayName = 'CrmWorkspace';

// Page orchestrator: loads configs, seeds CrmProvider, renders workspace.
// Both notes and conversations are embedded inside each contact.
export const ContactDetailsPage = memo(({ notesOpen, onCloseNotes }: ContactDetailsPageProps) => {
  const [data, setData] = useState<CrmBootstrapData | null>(null);

  useEffect(() => {
    void (async () => {
      const [fields, contactData] = await Promise.all([
        crmApi.getContactFields(),
        crmApi.getContactData(),
      ]);
      setData({ fields, contactData });
    })();
  }, []);

  const initialOpenFolders = useMemo(() => {
    if (!data) return {};
    return data.fields.folders.reduce<Record<string, boolean>>((acc, folder) => {
      acc[folder.id] = folder.defaultOpen ?? true;
      return acc;
    }, {});
  }, [data]);

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
        Loading Pulse CRM…
      </div>
    );
  }

  return (
    <CrmProvider
      initialContacts={data.contactData.contacts}
      initialOpenFolders={initialOpenFolders}
    >
      <CrmWorkspace
        fieldsConfig={data.fields}
        notesOpen={notesOpen}
        onCloseNotes={onCloseNotes}
      />
    </CrmProvider>
  );
});

ContactDetailsPage.displayName = 'ContactDetailsPage';
