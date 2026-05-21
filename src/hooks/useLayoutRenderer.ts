import { useMemo } from 'react';

import type { LayoutSection } from '@/types';

// Hook that prepares and memoizes layout sections before rendering.
export const useLayoutRenderer = (sections: LayoutSection[]): LayoutSection[] =>
  useMemo(() => {
    // TODO: Add permission-based layout visibility rules per user role.
    return [...sections].sort((left, right) => left.order - right.order);
  }, [sections]);
