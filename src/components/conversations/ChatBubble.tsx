import { memo } from 'react';

import { useCrm } from '@/context';
import type { ChatConversation } from '@/types';
import { formatClockTime, getAvatarHue, getInitials } from '@/utils';

interface ChatBubbleProps {
  chat: ChatConversation;
}

// Chat message bubble. Inbound = left aligned with avatar, outbound = right aligned blue.
export const ChatBubble = memo(({ chat }: ChatBubbleProps) => {
  const { selectedContact } = useCrm();
  const isInbound = chat.direction === 'inbound';
  const contactDisplayName = selectedContact
    ? `${selectedContact.firstName} ${selectedContact.lastName}`.trim()
    : chat.sender.name;
  const avatarName = isInbound ? contactDisplayName : chat.sender.name;
  const hue = getAvatarHue(avatarName);

  if (isInbound) {
    return (
      <div className="flex items-start gap-2">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white shadow-sm"
          style={{ backgroundColor: `hsl(${hue} 55% 50%)` }}
        >
          {getInitials(avatarName)}
        </span>
        <div className="relative max-w-[75%] rounded-xl bg-[#fff3e4] px-3.5 py-2.5 shadow-sm before:absolute before:-left-2 before:top-3.5 before:block before:h-0 before:w-0 before:content-[''] before:border-y-[7px] before:border-r-[8px] before:border-l-0 before:border-y-transparent before:border-r-[#fff3e4]">
          <p className="text-xs font-semibold text-slate-600">{chat.sender.name}</p>
          <p className="mt-0.5 text-sm leading-snug text-slate-800">{chat.body}</p>
          <p className="mt-1.5 text-[10px] text-slate-400">{formatClockTime(chat.createdAt)}</p>
        </div>
      </div>
    );
  }

  // Outbound chat (sent by current user) — right aligned, blue.
  return (
    <div className="flex items-end justify-end gap-2">
      <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-blue-600 px-3 py-2 text-white">
        <p className="text-sm">{chat.body}</p>
        <p className="mt-1 text-right text-[10px] text-blue-100">{formatClockTime(chat.createdAt)}</p>
      </div>
    </div>
  );
});

ChatBubble.displayName = 'ChatBubble';
