import { memo, useMemo, useState } from 'react';

import { useCrm } from '@/context';

import { AddContactModal } from './AddContactModal';
import { ContactListItem } from './ContactListItem';

// Full-sidebar contact list shown when the user clicks the back arrow.
export const ContactList = memo(() => {
  const { contacts, selectedContactId, setSelectedContactId, setViewMode } = useCrm();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter((c) =>
      `${c.firstName} ${c.lastName} ${c.email ?? ''}`.toLowerCase().includes(term),
    );
  }, [contacts, search]);

  const handleSelect = (id: number) => {
    setSelectedContactId(id);
    setViewMode('detail');
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="text-sm font-semibold text-slate-900">Contacts</h2>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add
        </button>
      </header>

      <div className="my-3">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts"
            className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {filtered.length ? (
          <ul className="space-y-1">
            {filtered.map((contact) => (
              <li key={contact.id}>
                <ContactListItem
                  contact={contact}
                  selected={contact.id === selectedContactId}
                  onSelect={handleSelect}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
            No contacts found.
          </p>
        )}
      </div>

      {showAdd && <AddContactModal onClose={() => setShowAdd(false)} />}
    </div>
  );
});

ContactList.displayName = 'ContactList';
