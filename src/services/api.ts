import { contactData, contactFields, conversations, notes } from '@/configs';
import type {
  ContactFollower,
  ContactOwner,
  ContactRecord,
  ContactDataConfig,
  ContactFieldsConfig,
  ConversationsConfig,
  NotesConfig,
} from '@/types';

// Mock API layer that keeps data access separate from components.
// Conversations are now stored separately by contactId and merged here.
interface ContactRecordInput {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address?: string;
  businessName?: string;
  streetAddress?: string;
  city?: string;
  country?: string;
  owner?: ContactOwner | string;
  followers?: Array<ContactFollower | string>;
  tags?: string[];
}

const normalizeOwner = (
  owner: ContactRecordInput['owner'],
  fallbackId: number,
): ContactOwner | undefined => {
  if (!owner) return undefined;
  if (typeof owner === 'string') {
    return { id: fallbackId, name: owner };
  }
  return owner;
};

const normalizeFollowers = (
  followers: ContactRecordInput['followers'],
): ContactFollower[] => {
  if (!followers?.length) return [];
  return followers.map((follower, idx) =>
    typeof follower === 'string'
      ? { id: idx + 1, name: follower }
      : follower,
  );
};

export const crmApi = {
  getContactFields: async (): Promise<ContactFieldsConfig> =>
    Promise.resolve(contactFields as ContactFieldsConfig),
  getContactData: async (): Promise<ContactDataConfig> => {
    // TODO: Replace with real API integration.
    // TODO: Add caching strategy for frequently opened contacts.
    const notesByContactId = (notes as NotesConfig).notesByContactId ?? {};
    const conversationsByContactId =
      (conversations as ConversationsConfig).conversationsByContactId ?? {};

    const normalizedContacts = (contactData.contacts as ContactRecordInput[]).map(
      (contact, idx): ContactRecord => ({
        ...contact,
        owner: normalizeOwner(contact.owner, idx + 1),
        followers: normalizeFollowers(contact.followers),
        notes: notesByContactId[String(contact.id)] ?? [],
        conversations: conversationsByContactId[String(contact.id)] ?? [],
      }),
    );

    return Promise.resolve({ contacts: normalizedContacts });
  },
};
