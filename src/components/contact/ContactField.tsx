import { memo } from 'react';

import type { ContactField as ContactFieldModel, ContactValue } from '@/types';

import { FieldRenderer } from './FieldRenderer';

interface ContactFieldProps {
  field: ContactFieldModel;
  value: ContactValue;
}

// Thin wrapper around the dynamic field renderer; lets folders space children consistently.
export const ContactField = memo(({ field, value }: ContactFieldProps) => (
  <FieldRenderer field={field} value={value} />
));

ContactField.displayName = 'ContactField';
