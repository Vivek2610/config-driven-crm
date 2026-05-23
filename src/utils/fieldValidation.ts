import type { ContactField } from '@/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneDigits = (value: string): string => value.replace(/\D/g, '');

export const isValidPhone = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return true;

  const digits = phoneDigits(trimmed);
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
};

export const validateContactField = (
  type: ContactField['type'],
  value: string,
): string | null => {
  const trimmed = value.trim();

  if (type === 'email' && trimmed && !EMAIL_RE.test(trimmed)) {
    return 'Please enter a valid email address.';
  }

  if (type === 'phone' && trimmed && !isValidPhone(trimmed)) {
    return 'Please enter a valid phone number (e.g. (555) 000-0000).';
  }

  return null;
};
