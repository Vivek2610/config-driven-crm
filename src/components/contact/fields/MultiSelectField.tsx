import { memo } from 'react';

import type { RenderFieldProps } from '@/utils';

// Multi-select rendered as inline chips.
export const MultiSelectField = memo(({ field, value }: RenderFieldProps) => {
  const values = Array.isArray(value) ? value : [];
  const labels = values.map(
    (v) => field.options?.find((opt) => opt.value === v)?.label ?? v,
  );

  return (
    <div className="space-y-1">
      <p className="text-xs text-slate-500">{field.label}</p>
      {labels.length ? (
        <div className="flex flex-wrap gap-1.5">
          {labels.map((label) => (
            <span
              key={label}
              className="rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700"
            >
              {label}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">—</p>
      )}
    </div>
  );
});

MultiSelectField.displayName = 'MultiSelectField';
