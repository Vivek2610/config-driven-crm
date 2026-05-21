import { memo } from 'react';

import { useCrm } from '@/context';

// Top header strip: back arrow, "Contact Details" title, and prev/next pager.
export const ContactDetailsHeader = memo(() => {
  const { contacts, selectedIndex, setViewMode, goToPrev, goToNext } = useCrm();

  const canPrev = selectedIndex > 0;
  const canNext = selectedIndex >= 0 && selectedIndex < contacts.length - 1;

  return (
    <header className="flex items-center justify-between border-b border-slate-200 pb-3">
      <button
        type="button"
        onClick={() => setViewMode('list')}
        className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition hover:text-blue-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Contact Details
      </button>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>
          {selectedIndex >= 0 ? selectedIndex + 1 : 0} of {contacts.length}
        </span>
        <button
          type="button"
          onClick={goToPrev}
          disabled={!canPrev}
          className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={goToNext}
          disabled={!canNext}
          className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </header>
  );
});

ContactDetailsHeader.displayName = 'ContactDetailsHeader';
