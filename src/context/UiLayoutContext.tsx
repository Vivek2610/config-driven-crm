import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { layout as layoutConfig } from '@/configs';
import type { LayoutMode } from '@/types';

// Global UI-layout state — kept separate from CRM domain state.
interface UiLayoutContextValue {
  layoutMode: LayoutMode;
  notesOpen: boolean;
  toggleNotes: () => void;
  closeNotes: () => void;
  mobileSection: string;
  setMobileSection: (id: string) => void;
}

const UiLayoutContext = createContext<UiLayoutContextValue | undefined>(undefined);

export { UiLayoutContext };

const getLayoutMode = (): LayoutMode => {
  if (typeof window === 'undefined') return 'desktop';
  const { mobile, tablet } = layoutConfig.breakpoints;
  const w = window.innerWidth;
  if (w < mobile) return 'mobile';
  if (w < tablet) return 'tablet';
  return 'desktop';
};

interface UiLayoutProviderProps {
  children: ReactNode;
}

export const UiLayoutProvider = ({ children }: UiLayoutProviderProps) => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => getLayoutMode());
  const [notesOpen, setNotesOpen] = useState<boolean>(true);
  const [mobileSection, setMobileSection] = useState<string>(
    layoutConfig.mobile.defaultSection,
  );

  // Re-evaluate layout mode whenever the viewport crosses a breakpoint.
  useEffect(() => {
    const handler = () => setLayoutMode(getLayoutMode());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // When dropping into tablet/mobile, close inline notes — they reopen as a drawer.
  useEffect(() => {
    if (layoutMode !== 'desktop') {
      setNotesOpen(false);
    }
  }, [layoutMode]);

  const toggleNotes = useCallback(() => setNotesOpen((prev) => !prev), []);
  const closeNotes = useCallback(() => setNotesOpen(false), []);

  const value = useMemo<UiLayoutContextValue>(
    () => ({
      layoutMode,
      notesOpen,
      toggleNotes,
      closeNotes,
      mobileSection,
      setMobileSection,
    }),
    [layoutMode, notesOpen, toggleNotes, closeNotes, mobileSection],
  );

  return <UiLayoutContext.Provider value={value}>{children}</UiLayoutContext.Provider>;
};
