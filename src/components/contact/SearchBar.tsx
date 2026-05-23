import { ListFilter, Search } from 'lucide-react';
import { memo } from 'react';

import { useCrm } from '@/context';

// Compact CRM search with leading search icon and trailing filter icon.
export const SearchBar = memo(() => {
  const { searchTerm, setSearchTerm } = useCrm();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-blue-400">
      <Search className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Fields and Folders"
        className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
      <button type="button" title="Filter" className="text-slate-400 hover:text-slate-700">
        <ListFilter className="h-4 w-4" strokeWidth={1.8} />
      </button>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
