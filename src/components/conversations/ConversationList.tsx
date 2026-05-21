import { memo } from 'react';

import type { Conversation } from '@/types';

import { ChatBubble } from './ChatBubble';
import { EmailCard } from './EmailCard';

interface ConversationListProps {
  conversations: Conversation[];
}

// Renders a mixed timeline of emails and chats in chronological order.
export const ConversationList = memo(({ conversations }: ConversationListProps) => {
  if (!conversations.length) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="rounded-lg border border-dashed border-slate-200 px-6 py-4 text-center text-sm text-slate-500">
          No conversations yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conv) =>
        conv.type === 'email' ? (
          <EmailCard key={conv.id} email={conv} />
        ) : (
          <ChatBubble key={conv.id} chat={conv} />
        ),
      )}
    </div>
  );
});

ConversationList.displayName = 'ConversationList';
