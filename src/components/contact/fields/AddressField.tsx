import { memo } from 'react';

import type { RenderFieldProps } from '@/utils';

// Multi-line address display.
export const AddressField = memo(({ field, value }: RenderFieldProps) => {
  const text = typeof value === 'string' ? value : '';

  return (
    <div className="space-y-1">
      <p className="text-xs text-slate-500">{field.label}</p>
      {text ? (
        <p className="whitespace-pre-line text-sm font-medium leading-snug text-slate-900">
          {text.replace(/,\s*/g, '\n')}
        </p>
      ) : (
        <p className="text-sm text-slate-400">{field.placeholder ?? '—'}</p>
      )}
    </div>
  );
});

AddressField.displayName = 'AddressField';
