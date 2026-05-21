import { memo } from 'react';

import { useCrm } from '@/context';

// Compact CRM search with leading search icon and trailing filter icon.
export const SearchBar = memo(() => {
  const { searchTerm, setSearchTerm } = useCrm();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-blue-400">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4 text-slate-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Fields and Folders"
        className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
      <button type="button" title="Filter" className="text-slate-400 hover:text-slate-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M6 12h12m-7.5 7.5h3" />
        </svg>
      </button>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
