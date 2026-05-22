import { useEffect, useState } from 'react';

import { layout as layoutConfig } from '@/configs';
import type { LayoutMode } from '@/types';

const computeMode = (): LayoutMode => {
  if (typeof window === 'undefined') return 'desktop';
  const { mobile, tablet } = layoutConfig.breakpoints;
  const w = window.innerWidth;
  if (w < mobile) return 'mobile';
  if (w < tablet) return 'tablet';
  return 'desktop';
};

// Returns the current layout mode based on the window width and layout.json breakpoints.
// Standalone version of the mode tracking done inside UiLayoutContext — use this
// from purely visual components that don't need other layout state.
export const useBreakpoint = (): LayoutMode => {
  const [mode, setMode] = useState<LayoutMode>(() => computeMode());

  useEffect(() => {
    const handler = () => setMode(computeMode());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return mode;
};
