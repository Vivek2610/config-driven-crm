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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>
          {phone && (
            <a
              href={`tel:${phone}`}
              title="Call"
              className="rounded-md bg-green-100 p-1.5 text-green-700 transition hover:bg-green-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

PhoneField.displayName = 'PhoneField';
