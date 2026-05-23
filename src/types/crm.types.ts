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

export type LayoutMode = 'desktop' | 'tablet' | 'mobile';

export type SectionMode = 'inline' | 'drawer' | 'page';

export type LayoutContainerType = 'flex' | 'grid' | 'stack';

export type NavPosition = 'right' | 'left' | 'bottom' | 'top' | 'hidden';

export type DrawerPosition = 'right' | 'left' | 'bottom' | 'top';

// Single layout section in the config (e.g. Sidebar/Main/Notes).
export interface LayoutSection {
  id: string;
  component: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  flex?: number;
  visible?: boolean;
  order?: number;
  mode?: SectionMode;
}

export interface DrawerConfig {
  position: DrawerPosition;
  width?: string;
  height?: string;
  overlay?: boolean;
}

export interface LayoutBreakpoints {
  mobile: number;
  tablet: number;
}

export interface DesktopLayoutConfig {
  type: LayoutContainerType;
  navPosition: NavPosition;
  sections: LayoutSection[];
  drawer?: DrawerConfig;
}

export interface TabletLayoutConfig extends DesktopLayoutConfig {
  drawer?: DrawerConfig;
}

export interface MobileLayoutConfig {
  type: LayoutContainerType;
  navPosition: NavPosition;
  defaultSection: string;
  sections: LayoutSection[];
  drawer?: DrawerConfig;
}

// Root layout definition — sourced from layout.json.
export interface LayoutDefinition {
  breakpoints: LayoutBreakpoints;
  desktop: DesktopLayoutConfig;
  tablet: TabletLayoutConfig;
  mobile: MobileLayoutConfig;
}

export type LayoutModeConfig =
  | DesktopLayoutConfig
  | TabletLayoutConfig
  | MobileLayoutConfig;

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
  notesByContactId: Record<string, Note[]>;
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
  conversationsByContactId: Record<string, Conversation[]>;
}
