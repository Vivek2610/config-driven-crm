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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-3 w-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={handleSend}
        disabled={!hasText}
        title="Send"
        className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
      </button>
    </div>
  );
});

ConversationComposer.displayName = 'ConversationComposer';
