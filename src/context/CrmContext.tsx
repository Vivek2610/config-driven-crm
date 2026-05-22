import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type {
  ContactRecord,
  ContactTab,
  Conversation,
  ConversationType,
  Note,
} from '@/types';

export type ViewMode = 'list' | 'detail';

interface CrmContextValue {
  contacts: ContactRecord[];
  selectedContactId: number | null;
  selectedContact: ContactRecord | null;
  selectedIndex: number;
  activeTab: ContactTab;
  openFolders: Record<string, boolean>;
  searchTerm: string;
  viewMode: ViewMode;
  selectedContactNotes: Note[];
  selectedContactConversations: Conversation[];
  setSelectedContactId: (id: number | null) => void;
  setActiveTab: (tab: ContactTab) => void;
  toggleFolder: (folderId: string) => void;
  setSearchTerm: (term: string) => void;
  setViewMode: (mode: ViewMode) => void;
  addContact: (contact: Omit<ContactRecord, 'id'>) => void;
  // Merges a partial patch into the selected contact record.
  updateContact: (patch: Partial<ContactRecord>) => void;
  addNote: (body: string) => void;
  // Appends an outbound message (email or chat) to the active contact's thread.
  sendConversation: (body: string, type: ConversationType, subject?: string) => void;
  // Toggles the starred state of an email conversation for the active contact.
  toggleConversationStar: (conversationId: string) => void;
  goToPrev: () => void;
  goToNext: () => void;
}

const CrmContext = createContext<CrmContextValue | undefined>(undefined);

interface CrmProviderProps {
  initialContacts: ContactRecord[];
  initialOpenFolders?: Record<string, boolean>;
  children: ReactNode;
}

const buildNotesMap = (contacts: ContactRecord[]): Record<number, Note[]> =>
  contacts.reduce<Record<number, Note[]>>((acc, c) => {
    acc[c.id] = c.notes ?? [];
    return acc;
  }, {});

const buildConversationsMap = (
  contacts: ContactRecord[],
): Record<number, Conversation[]> =>
  contacts.reduce<Record<number, Conversation[]>>((acc, c) => {
    acc[c.id] = c.conversations ?? [];
    return acc;
  }, {});

// Centralized CRM state. Notes & conversations are scoped per contact.
export const CrmProvider = ({
  initialContacts,
  initialOpenFolders = {},
  children,
}: CrmProviderProps) => {
  const [contacts, setContacts] = useState<ContactRecord[]>(initialContacts);

  const [notesMap, setNotesMap] = useState<Record<number, Note[]>>(
    () => buildNotesMap(initialContacts),
  );
  const [conversationsMap, setConversationsMap] = useState<Record<number, Conversation[]>>(
    () => buildConversationsMap(initialContacts),
  );

  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<ContactTab>('allFields');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(initialOpenFolders);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const selectedContact = useMemo(
    () => contacts.find((c) => c.id === selectedContactId) ?? null,
    [contacts, selectedContactId],
  );

  const selectedIndex = useMemo(
    () => contacts.findIndex((c) => c.id === selectedContactId),
    [contacts, selectedContactId],
  );

  const selectedContactNotes = useMemo(
    () => (selectedContactId !== null ? (notesMap[selectedContactId] ?? []) : []),
    [notesMap, selectedContactId],
  );

  const selectedContactConversations = useMemo(
    () => (selectedContactId !== null ? (conversationsMap[selectedContactId] ?? []) : []),
    [conversationsMap, selectedContactId],
  );

  const toggleFolder = useCallback((folderId: string) => {
    setOpenFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  }, []);

  const addContact = useCallback((newContact: Omit<ContactRecord, 'id'>) => {
    setContacts((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((c) => c.id)) + 1 : 1;
      const created: ContactRecord = { id: nextId, ...newContact };
      setNotesMap((m) => ({ ...m, [nextId]: [] }));
      setConversationsMap((m) => ({ ...m, [nextId]: [] }));
      setSelectedContactId(nextId);
      return [...prev, created];
    });
  }, []);

  const updateContact = useCallback(
    (patch: Partial<ContactRecord>) => {
      if (selectedContactId === null) return;
      setContacts((prev) =>
        prev.map((c) => (c.id === selectedContactId ? { ...c, ...patch } : c)),
      );
    },
    [selectedContactId],
  );

  const addNote = useCallback(
    (body: string) => {
      const trimmed = body.trim();
      if (!trimmed || selectedContactId === null) return;

      const newNote: Note = {
        id: `note-${Date.now()}`,
        body: trimmed,
        createdAt: new Date().toISOString(),
      };
      setNotesMap((prev) => ({
        ...prev,
        [selectedContactId]: [newNote, ...(prev[selectedContactId] ?? [])],
      }));
    },
    [selectedContactId],
  );

  const sendConversation = useCallback(
    (body: string, type: ConversationType, subject?: string) => {
      const trimmed = body.trim();
      if (!trimmed || selectedContactId === null) return;

      const base = {
        id: `conv-${Date.now()}`,
        direction: 'outbound' as const,
        sender: { name: 'Me' },
        createdAt: new Date().toISOString(),
      };

      const newConversation: Conversation =
        type === 'email'
          ? {
              ...base,
              type: 'email',
              subject: subject?.trim() || trimmed.split('\n')[0].slice(0, 80),
              body: trimmed,
              to: selectedContact ? `${selectedContact.firstName} ${selectedContact.lastName}`.trim() : 'Contact',
            }
          : { ...base, type: 'chat', body: trimmed };

      setConversationsMap((prev) => ({
        ...prev,
        [selectedContactId]: [...(prev[selectedContactId] ?? []), newConversation],
      }));
    },
    [selectedContactId, selectedContact],
  );

  const toggleConversationStar = useCallback(
    (conversationId: string) => {
      if (selectedContactId === null) return;

      setConversationsMap((prev) => ({
        ...prev,
        [selectedContactId]: (prev[selectedContactId] ?? []).map((conversation) => {
          if (conversation.id !== conversationId || conversation.type !== 'email') {
            return conversation;
          }
          return { ...conversation, starred: !conversation.starred };
        }),
      }));
    },
    [selectedContactId],
  );

  const goToPrev = useCallback(() => {
    setSelectedContactId((current) => {
      const idx = contacts.findIndex((c) => c.id === current);
      if (idx <= 0) return current;
      return contacts[idx - 1].id;
    });
  }, [contacts]);

  const goToNext = useCallback(() => {
    setSelectedContactId((current) => {
      const idx = contacts.findIndex((c) => c.id === current);
      if (idx === -1 || idx >= contacts.length - 1) return current;
      return contacts[idx + 1].id;
    });
  }, [contacts]);

  const value = useMemo<CrmContextValue>(
    () => ({
      contacts,
      selectedContactId,
      selectedContact,
      selectedIndex,
      activeTab,
      openFolders,
      searchTerm,
      viewMode,
      selectedContactNotes,
      selectedContactConversations,
      setSelectedContactId,
      setActiveTab,
      toggleFolder,
      setSearchTerm,
      setViewMode,
      addContact,
      updateContact,
      addNote,
      sendConversation,
      toggleConversationStar,
      goToPrev,
      goToNext,
    }),
    [
      contacts,
      selectedContactId,
      selectedContact,
      selectedIndex,
      activeTab,
      openFolders,
      searchTerm,
      viewMode,
      selectedContactNotes,
      selectedContactConversations,
      toggleFolder,
      addContact,
      updateContact,
      addNote,
      sendConversation,
      toggleConversationStar,
      goToPrev,
      goToNext,
    ],
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
};

export const useCrm = (): CrmContextValue => {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error('useCrm must be used within a CrmProvider');
  return ctx;
};
