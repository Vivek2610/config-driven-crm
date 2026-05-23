import { ChevronDown, Phone, Plus, X } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';

import { useCrm } from '@/context';
import type { ContactRecord } from '@/types';
import { getAvatarHue, getInitials } from '@/utils';

interface ContactSummaryCardProps {
  contact: ContactRecord;
}

// Header summary tile: avatar, name, call button, owner, followers dropdown, editable tags.
export const ContactSummaryCard = memo(({ contact }: ContactSummaryCardProps) => {
  const { updateContact } = useCrm();
  const fullName = `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim();
  const hue = getAvatarHue(fullName || 'Contact');

  /* ── Followers dropdown ─────────────────────────────────────── */
  const [showFollowers, setShowFollowers] = useState(false);
  const followersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showFollowers) return;
    const handler = (e: MouseEvent) => {
      if (followersRef.current && !followersRef.current.contains(e.target as Node))
        setShowFollowers(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [showFollowers]);

  /* ── Tag management ─────────────────────────────────────────── */
  const [addingTag, setAddingTag] = useState(false);
  const [tagDraft, setTagDraft] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  const openTagInput = () => {
    setAddingTag(true);
    setTimeout(() => tagInputRef.current?.focus(), 0);
  };

  const commitTag = () => {
    const trimmed = tagDraft.trim();
    if (trimmed && !(contact.tags ?? []).includes(trimmed)) {
      updateContact({ tags: [...(contact.tags ?? []), trimmed] });
    }
    setTagDraft('');
    setAddingTag(false);
  };

  const removeTag = (tag: string) => {
    updateContact({ tags: (contact.tags ?? []).filter((t) => t !== tag) });
  };

  const followers = contact.followers ?? [];

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      {/* Avatar + name + call */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: `hsl(${hue} 55% 50%)` }}
          >
            {getInitials(fullName) || '?'}
          </span>
          <p className="text-base font-semibold text-slate-900">{fullName || 'New Contact'}</p>
        </div>
        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            title="Call"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700 transition hover:bg-green-200"
          >
            <Phone className="h-4 w-4" strokeWidth={1.8} />
          </a>
        )}
      </div>

      {/* Owner + Followers */}
      <div className="grid grid-cols-2 gap-3">
        {/* Owner */}
        <div className="space-y-1">
          <p className="text-xs text-slate-500">Owner</p>
          {contact.owner ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-800 hover:bg-slate-50"
            >
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold text-white"
                style={{ backgroundColor: `hsl(${getAvatarHue(contact.owner.name)} 55% 50%)` }}
              >
                {getInitials(contact.owner.name)}
              </span>
              {contact.owner.name}
              <ChevronDown className="h-3 w-3 text-slate-500" strokeWidth={1.6} />
            </button>
          ) : (
            <p className="text-xs text-slate-400">—</p>
          )}
        </div>

        {/* Followers with dropdown list */}
        <div className="relative space-y-1" ref={followersRef}>
          <p className="text-xs text-slate-500">Followers</p>
          <button
            type="button"
            onClick={() => setShowFollowers((s) => !s)}
            className="flex w-full items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 transition hover:bg-slate-50"
          >
            <div className="flex -space-x-1.5">
              {followers.slice(0, 3).map((f) => (
                <span
                  key={f.id}
                  title={f.name}
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-white text-[9px] font-semibold text-white"
                  style={{ backgroundColor: `hsl(${getAvatarHue(f.name)} 55% 50%)` }}
                >
                  {getInitials(f.name)}
                </span>
              ))}
              {!followers.length && (
                <span className="text-xs text-slate-400">None</span>
              )}
            </div>
            {followers.length > 3 && (
              <span className="ml-1 text-xs text-slate-500">+{followers.length - 3}</span>
            )}
            <ChevronDown className="ml-auto h-3 w-3 text-slate-500" strokeWidth={1.6} />
          </button>

          {/* Followers dropdown */}
          {showFollowers && (
            <div className="absolute left-0 top-full z-30 mt-1 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <p className="border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
                Followers ({followers.length})
              </p>
              {followers.length ? (
                <ul className="max-h-48 overflow-y-auto py-1">
                  {followers.map((f) => (
                    <li key={f.id} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-slate-50">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                        style={{ backgroundColor: `hsl(${getAvatarHue(f.name)} 55% 50%)` }}
                      >
                        {getInitials(f.name)}
                      </span>
                      <span className="text-sm text-slate-800">{f.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-3 text-xs text-slate-400">No followers yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tags — add/remove */}
      <div className="space-y-1.5">
        <p className="text-xs text-slate-500">Tags</p>
        <div className="flex flex-wrap gap-1.5">
          {(contact.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
                className="ml-0.5 rounded-full text-sky-400 transition hover:text-sky-700"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </span>
          ))}

          {addingTag ? (
            <span className="inline-flex items-center gap-1">
              <input
                ref={tagInputRef}
                type="text"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitTag();
                  if (e.key === 'Escape') { setAddingTag(false); setTagDraft(''); }
                }}
                onBlur={commitTag}
                placeholder="New tag…"
                className="h-6 w-24 rounded-full border border-sky-300 bg-sky-50 px-2 text-xs text-sky-900 outline-none focus:border-sky-500"
              />
            </span>
          ) : (
            <button
              type="button"
              onClick={openTagInput}
              title="Add tag"
              className="inline-flex h-6 items-center gap-0.5 rounded-full border border-dashed border-sky-300 bg-sky-50 px-2.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
            >
              <Plus className="h-3 w-3" strokeWidth={2} />
              Add
            </button>
          )}
        </div>
      </div>
    </section>
  );
});

ContactSummaryCard.displayName = 'ContactSummaryCard';
