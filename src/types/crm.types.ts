// Shared CRM domain types used by config, UI components, and services.

export type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'address'
  | 'radio'
  | 'multiSelect'
  | 'tags'
  | 'avatarSelect';

export type LayoutSectionType = 'sidebar' | 'main' | 'notes';

export interface LayoutSection {
  id: string;
  title: string;
  type: LayoutSectionType;
  order: number;
  className: string;
}

export interface LayoutConfig {
  sections: LayoutSection[];
}

export interface ContactFieldOption {
  label: string;
  value: string;
}

// Field config — `key` matches the property on a ContactRecord.
export interface ContactField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: ContactFieldOption[];
  visible?: boolean;
}

// Folder config wraps a collection of fields.
export interface ContactFolder {
  id: string;
  name: string;
  collapsible?: boolean;
  addable?: boolean;
  defaultOpen?: boolean;
  fields: ContactField[];
}

export interface ContactFieldsConfig {
  folders: ContactFolder[];
}

export type ContactValue = string | string[] | number | null | undefined;

export interface ContactOwner {
  id: number;
  name: string;
  avatar?: string;
}

export interface ContactFollower {
  id: number;
  name: string;
  avatar?: string;
}

export interface ContactRecord {
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
  owner?: ContactOwner;
  followers?: ContactFollower[];
  tags?: string[];
  notes?: Note[];
  conversations?: Conversation[];
  [key: string]:
    | ContactValue
    | ContactOwner
    | ContactFollower[]
    | Note[]
    | Conversation[]
    | undefined;
}

export interface ContactDataConfig {
  contacts: ContactRecord[];
}

export type ContactTab = 'allFields' | 'dnd' | 'actions';

export interface Note {
  id: string;
  title?: string;
  body: string;
  createdAt: string;
  author?: string;
}

export interface NotesConfig {
  notes: Note[];
}

// Conversation discriminated union: emails are cards, chats are bubbles.
export type ConversationType = 'email' | 'chat';

interface ConversationBase {
  id: string;
  type: ConversationType;
  createdAt: string;
  // 'inbound' = from the contact to us, 'outbound' = sent by us.
  direction: 'inbound' | 'outbound';
  sender: {
    name: string;
    avatar?: string;
  };
}

export interface EmailConversation extends ConversationBase {
  type: 'email';
  subject: string;
  body: string;
  // To header (e.g. "Me").
  to: string;
  // Number of emails in the thread; renders the centered circle badge if > 1.
  threadCount?: number;
  starred?: boolean;
  trackUrl?: string;
}

export interface ChatConversation extends ConversationBase {
  type: 'chat';
  body: string;
}

export type Conversation = EmailConversation | ChatConversation;

export interface ConversationsConfig {
  conversations: Conversation[];
}
