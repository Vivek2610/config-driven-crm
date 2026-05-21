import { memo } from 'react';

import type { ContactRecord } from '@/types';
import { getAvatarHue, getInitials } from '@/utils';

interface ContactSummaryCardProps {
  contact: ContactRecord;
}

// Header summary tile: avatar, name, call button, owner, followers, tags.
export const ContactSummaryCard = memo(({ contact }: ContactSummaryCardProps) => {
  const fullName = `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim();
  const hue = getAvatarHue(fullName || 'Contact');

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      {/* Avatar + name + call */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
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
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700 transition hover:bg-green-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
          </a>
        )}
      </div>

      {/* Owner + Followers */}
      <div className="grid grid-cols-2 gap-3">
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="h-3 w-3 text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          ) : (
            <p className="text-xs text-slate-400">—</p>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs text-slate-500">Followers</p>
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1.5">
              {(contact.followers ?? []).slice(0, 3).map((f) => (
                <span
                  key={f.id}
                  title={f.name}
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-white text-[9px] font-semibold text-white"
                  style={{ backgroundColor: `hsl(${getAvatarHue(f.name)} 55% 50%)` }}
                >
                  {getInitials(f.name)}
                </span>
              ))}
              {!contact.followers?.length && (
                <span className="text-xs text-slate-400">—</span>
              )}
            </div>
            {(contact.followers?.length ?? 0) > 3 && (
              <span className="text-xs text-slate-500">
                +{(contact.followers?.length ?? 0) - 3}
              </span>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="ml-auto h-3 w-3 text-slate-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-1">
        <p className="text-xs text-slate-500">Tags</p>
        <div className="flex flex-wrap gap-1.5">
          {(contact.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700"
            >
              {tag}
              <button type="button" className="text-sky-500 hover:text-sky-700" aria-label={`Remove ${tag}`}>
                ×
              </button>
            </span>
          ))}
          <button
            type="button"
            className="rounded-md border border-dashed border-sky-300 bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700 hover:bg-sky-100"
            title="Add tag"
          >
            +
          </button>
        </div>
      </div>
    </section>
  );
});

ContactSummaryCard.displayName = 'ContactSummaryCard';
