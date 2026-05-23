import { ChevronDown, MessageCircle } from 'lucide-react';
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
          <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
          Conversations
          <ChevronDown className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.8} />
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
