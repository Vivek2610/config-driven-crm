import { memo } from 'react';

import type { RenderFieldProps } from '@/utils';

// Tags rendered as light-blue rounded pills, matching the contact summary chip style.
export const TagsField = memo(({ field, value }: RenderFieldProps) => {
  const tags = Array.isArray(value) ? value : typeof value === 'string' && value ? [value] : [];

  return (
    <div className="space-y-1">
      <p className="text-xs text-slate-500">{field.label}</p>
      {tags.length ? (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">—</p>
      )}
    </div>
  );
});

TagsField.displayName = 'TagsField';
