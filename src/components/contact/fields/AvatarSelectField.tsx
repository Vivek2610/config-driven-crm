import { memo } from 'react';

import { getAvatarHue, getInitials, type RenderFieldProps } from '@/utils';

// Avatar + name dropdown chip used for Owner / Followers style fields.
export const AvatarSelectField = memo(({ field, value }: RenderFieldProps) => {
  const name = typeof value === 'string' ? value : '';

  if (!name) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-slate-500">{field.label}</p>
        <p className="text-sm text-slate-400">—</p>
      </div>
    );
  }

  const hue = getAvatarHue(name);

  return (
    <div className="space-y-1">
      <p className="text-xs text-slate-500">{field.label}</p>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-800 hover:bg-slate-50"
      >
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
          style={{ backgroundColor: `hsl(${hue} 55% 50%)` }}
        >
          {getInitials(name)}
        </span>
        {name}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="h-3.5 w-3.5 text-slate-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
    </div>
  );
});

AvatarSelectField.displayName = 'AvatarSelectField';
