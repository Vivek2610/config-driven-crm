import { memo } from 'react';

import type { RenderFieldProps } from '@/utils';

// Plain text display: small gray label on top, bold dark value below.
export const TextField = memo(({ field, value }: RenderFieldProps) => {
  const display = typeof value === 'string' && value.trim() ? value : field.placeholder ?? '—';

  return (
    <div className="space-y-1">
      <p className="text-xs text-slate-500">{field.label}</p>
      <p className="text-sm font-medium text-slate-900">{display}</p>
    </div>
  );
});

TextField.displayName = 'TextField';
