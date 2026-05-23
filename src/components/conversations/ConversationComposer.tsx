import {
  ChevronDown,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
} from 'lucide-react';
import { memo, useEffect, useRef, useState, type KeyboardEvent } from 'react';

import { useCrm } from '@/context';
import type { ConversationType } from '@/types';

// Bottom input bar — type selector (email/chat), text field, AI button, send.
export const ConversationComposer = memo(() => {
  const { sendConversation } = useCrm();
  const [type, setType] = useState<ConversationType>('chat');
  const [text, setText] = useState('');
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const typeMenuRef = useRef<HTMLDivElement>(null);

  // Close type dropdown on outside click.
  useEffect(() => {
    if (!showTypeMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (typeMenuRef.current && !typeMenuRef.current.contains(e.target as Node)) {
        setShowTypeMenu(false);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [showTypeMenu]);

  const hasText = text.trim().length > 0;

  const handleSend = () => {
    if (!hasText) return;
    sendConversation(text, type);
    setText('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
      {/* Left: type selector */}
      <div className="relative" ref={typeMenuRef}>
        <button
          type="button"
          onClick={() => setShowTypeMenu((s) => !s)}
          title={`Send as ${type}`}
          className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-slate-500 transition hover:bg-slate-50"
        >
          {type === 'email' ? (
            <Mail className="h-4 w-4" strokeWidth={1.8} />
          ) : (
            <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
          )}
          <ChevronDown className="h-3 w-3" strokeWidth={1.8} />
        </button>

        {showTypeMenu && (
          <ul className="absolute bottom-full left-0 z-10 mb-1 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg">
            {(['chat', 'email'] as ConversationType[]).map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => {
                    setType(opt);
                    setShowTypeMenu(false);
                  }}
                  className={[
                    'flex w-full items-center gap-2 px-3 py-1.5 text-left capitalize',
                    type === opt ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50',
                  ].join(' ')}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Middle: text input */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        placeholder={type === 'email' ? 'Compose email...' : 'Type your message...'}
        className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />

      {/* Right: AI + send */}
      <button
        type="button"
        title="Modify with AI (coming soon)"
        disabled={!hasText}
        className="flex h-8 w-8 items-center justify-center rounded-md text-violet-500 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        <Sparkles className="h-4 w-4" strokeWidth={1.8} />
      </button>
      <button
        type="button"
        onClick={handleSend}
        disabled={!hasText}
        title="Send"
        className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        <Send className="h-4 w-4" strokeWidth={1.8} />
      </button>
    </div>
  );
});

ConversationComposer.displayName = 'ConversationComposer';
