import { Pencil, Phone } from 'lucide-react';
import { memo } from 'react';

import type { RenderFieldProps } from '@/utils';

// Phone field with country flag, number, edit pencil, and green call button.
export const PhoneField = memo(({ field, value }: RenderFieldProps) => {
  const phone = typeof value === 'string' ? value : '';

  return (
    <div className="space-y-1">
      <p className="text-xs text-slate-500">{field.label}</p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none" aria-hidden="true">🇺🇸</span>
          <span className="text-sm font-medium text-slate-900">{phone || field.placeholder || '—'}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Edit"
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.6} />
          </button>
          {phone && (
            <a
              href={`tel:${phone}`}
              title="Call"
              className="rounded-md bg-green-100 p-1.5 text-green-700 transition hover:bg-green-200"
            >
              <Phone className="h-4 w-4" strokeWidth={1.8} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

PhoneField.displayName = 'PhoneField';
