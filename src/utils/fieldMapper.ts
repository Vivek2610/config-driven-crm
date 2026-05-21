import type { ComponentType } from 'react';

import {
  AddressField,
  AvatarSelectField,
  EmailField,
  MultiSelectField,
  PhoneField,
  RadioField,
  TagsField,
  TextField,
} from '@/components/contact/fields';
import type { ContactField, ContactValue, FieldType } from '@/types';

export interface RenderFieldProps {
  field: ContactField;
  value: ContactValue;
}

export type FieldComponent = ComponentType<RenderFieldProps>;

// Dynamic map that lets config decide which UI component renders a field.
export const fieldComponentMap: Record<FieldType, FieldComponent> = {
  text: TextField,
  email: EmailField,
  phone: PhoneField,
  address: AddressField,
  radio: RadioField,
  multiSelect: MultiSelectField,
  tags: TagsField,
  avatarSelect: AvatarSelectField,
};

export const getFieldComponent = (fieldType: FieldType): FieldComponent =>
  fieldComponentMap[fieldType] ?? TextField;
