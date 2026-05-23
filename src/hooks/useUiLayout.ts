import { useContext } from 'react';

import { UiLayoutContext } from '@/context/UiLayoutContext';

export const useUiLayout = () => {
  const ctx = useContext(UiLayoutContext);
  if (!ctx) throw new Error('useUiLayout must be used within a UiLayoutProvider');
  return ctx;
};
