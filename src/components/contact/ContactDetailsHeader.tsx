import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
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
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
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
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={goToNext}
          disabled={!canNext}
          className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
});

ContactDetailsHeader.displayName = 'ContactDetailsHeader';
