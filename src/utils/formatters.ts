import type { ContactFieldOption, ContactValue } from '@/types';

// Shared text formatting helpers to keep presentational components small.
export const formatValue = (
  value: ContactValue,
  options?: ContactFieldOption[],
): string => {
  if (value === null || value === undefined || value === '') return 'Not provided';

  if (Array.isArray(value)) {
    if (!options?.length) return value.join(', ');
    return value
      .map((entry) => options.find((option) => option.value === entry)?.label ?? entry)
      .join(', ');
  }

  if (typeof value === 'number') return String(value);

  if (!options?.length) return value;

  return options.find((option) => option.value === value)?.label ?? value;
};

export const formatTimestamp = (isoDate: string): string =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(isoDate));

// Returns relative time string e.g. "5 min ago", "2 hours ago".
export const formatRelativeTime = (isoDate: string): string => {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

// Returns a short time like "11:44 AM".
export const formatClockTime = (isoDate: string): string =>
  new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(isoDate));

export const getInitials = (name: string): string => {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
};

// Stable hue mapping for avatar fallbacks based on a name.
export const getAvatarHue = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
};
