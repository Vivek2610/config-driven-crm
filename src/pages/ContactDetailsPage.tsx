import { memo, useEffect, useMemo, useState } from 'react';

import { layout as layoutConfig } from '@/configs';
import { CrmProvider, useUiLayout } from '@/context';
import { PageLayout } from '@/layouts';
import { crmApi } from '@/services';
import type { ContactDataConfig, ContactFieldsConfig } from '@/types';

interface CrmBootstrapData {
  fields: ContactFieldsConfig;
  contactData: ContactDataConfig;
}

// Page-level orchestrator: loads config data, seeds CrmProvider, and hands the
// rendered shell over to <PageLayout/> which is driven entirely by layout.json.
// No CRM-specific layout JSX lives here anymore.
export const ContactDetailsPage = memo(() => {
  const [data, setData] = useState<CrmBootstrapData | null>(null);
  const { layoutMode } = useUiLayout();

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

  // Padding adapts to layout mode: tight on mobile, breathing room on tablet/desktop.
  const outerPadding = layoutMode === 'mobile' ? 'p-0' : 'p-4';

  return (
    <CrmProvider
      initialContacts={data.contactData.contacts}
      fieldsConfig={data.fields}
      initialOpenFolders={initialOpenFolders}
    >
      <div className={`flex h-full w-full flex-1 ${outerPadding}`}>
        <PageLayout config={layoutConfig} />
      </div>
    </CrmProvider>
  );
});

ContactDetailsPage.displayName = 'ContactDetailsPage';
