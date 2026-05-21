import { memo } from 'react';

import type { RenderFieldProps } from '@/utils';

// Radio rendered as a badge for the selected option.
export const RadioField = memo(({ field, value }: RenderFieldProps) => {
  const selected = typeof value === 'string' ? value : '';
  const label =
    field.options?.find((opt) => opt.value === selected)?.label ?? selected;

  return (
    <div className="space-y-1">
      <p className="text-xs text-slate-500">{field.label}</p>
      {label ? (
        <span className="inline-flex rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
          {label}
        </span>
      ) : (
        <p className="text-sm text-slate-400">—</p>
      )}
    </div>
  );
});

RadioField.displayName = 'RadioField';
