import { X } from 'lucide-react';
import { memo, useEffect, useMemo, useState, type FormEvent } from 'react';

import { useCrm } from '@/context';
import { crmApi } from '@/services';
import type { ContactField, ContactFieldsConfig, ContactRecord } from '@/types';

interface AddContactModalProps {
  onClose: () => void;
}

// Modal that dynamically generates form fields from contactFields.json.
// Editing/Saving is config-driven: no hardcoded form fields here.
export const AddContactModal = memo(({ onClose }: AddContactModalProps) => {
  const { addContact, setViewMode } = useCrm();

  const [fieldsConfig, setFieldsConfig] = useState<ContactFieldsConfig | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    void crmApi.getContactFields().then(setFieldsConfig);
  }, []);

  const allFields: ContactField[] = useMemo(
    () => fieldsConfig?.folders.flatMap((folder) => folder.fields) ?? [],
    [fieldsConfig],
  );

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newContact = { ...values } as Partial<ContactRecord> as Omit<ContactRecord, 'id'>;
    addContact(newContact);
    setViewMode('detail');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="text-base font-semibold text-slate-900">Add Contact</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="max-h-[60vh] space-y-3 overflow-y-auto px-5 py-4">
          {allFields.map((field) => (
            <div key={field.key} className="space-y-1">
              <label className="block text-xs font-medium text-slate-600" htmlFor={`add-${field.key}`}>
                {field.label}
              </label>
              {field.type === 'multiSelect' || field.type === 'radio' ? (
                <select
                  id={`add-${field.key}`}
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none focus:border-blue-400"
                  value={values[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                >
                  <option value="">Select…</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`add-${field.key}`}
                  type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                  placeholder={field.placeholder}
                  value={values[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none focus:border-blue-400"
                />
              )}
            </div>
          ))}
        </form>

        <footer className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Save Contact
          </button>
        </footer>
      </div>
    </div>
  );
});

AddContactModal.displayName = 'AddContactModal';
