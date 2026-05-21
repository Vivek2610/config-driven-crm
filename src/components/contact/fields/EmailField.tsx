import { memo } from 'react';

import type { RenderFieldProps } from '@/utils';

// Email field with label + clickable mailto link styled as plain CRM text.
export const EmailField = memo(({ field, value }: RenderFieldProps) => {
  const email = typeof value === 'string' ? value : '';

  return (
    <div className="space-y-1">
      <p className="text-xs text-slate-500">{field.label}</p>
      {email ? (
        <a href={`mailto:${email}`} className="text-sm font-medium text-slate-900 hover:text-blue-600">
          {email}
        </a>
      ) : (
        <p className="text-sm text-slate-400">{field.placeholder ?? '—'}</p>
      )}
    </div>
  );
});

EmailField.displayName = 'EmailField';
