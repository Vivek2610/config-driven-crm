import { memo } from 'react';

import { ConversationComposer, ConversationList } from '@/components/conversations';
import { useCrm } from '@/context';

// Center panel: "Conversations" header, scrollable thread, composer at the bottom.
export const MainPanel = memo(() => {
  const { selectedContactConversations } = useCrm();

  return (
    <main className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-3">
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
          Conversations
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-3.5 w-3.5 text-slate-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </header>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <ConversationList conversations={selectedContactConversations} />
      </div>

      {/* Composer at the bottom */}
      <div className="shrink-0 border-t border-slate-100 bg-slate-50 px-3 py-3">
        <ConversationComposer />
      </div>
    </main>
  );
});

MainPanel.displayName = 'MainPanel';
