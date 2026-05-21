import { memo } from 'react';

import type { ContactField, ContactValue } from '@/types';
import { getFieldComponent } from '@/utils';

interface FieldRendererProps {
  field: ContactField;
  value: ContactValue;
}

// Picks the right field component using the field type → component map.
export const FieldRenderer = memo(({ field, value }: FieldRendererProps) => {
  const FieldComponent = getFieldComponent(field.type);
  return <FieldComponent field={field} value={value} />;
});

FieldRenderer.displayName = 'FieldRenderer';
