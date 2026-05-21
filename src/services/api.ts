import { contactData, contactFields, layout, notes } from '@/configs';
import type {
  ContactDataConfig,
  ContactFieldsConfig,
  LayoutConfig,
  NotesConfig,
} from '@/types';

// Mock API layer that keeps data access separate from components.
// Conversations are now embedded inside each ContactRecord and read via context.
export const crmApi = {
  getLayout: async (): Promise<LayoutConfig> => {
    // TODO: Support layout switching from user preferences.
    return Promise.resolve(layout as LayoutConfig);
  },
  getContactFields: async (): Promise<ContactFieldsConfig> =>
    Promise.resolve(contactFields as ContactFieldsConfig),
  getContactData: async (): Promise<ContactDataConfig> => {
    // TODO: Replace with real API integration.
    // TODO: Add caching strategy for frequently opened contacts.
    return Promise.resolve(contactData as ContactDataConfig);
  },
  getNotes: async (): Promise<NotesConfig> => Promise.resolve(notes as NotesConfig),
};
