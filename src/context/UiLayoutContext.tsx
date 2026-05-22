import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { layout as layoutConfig } from '@/configs';
import type { LayoutMode } from '@/types';

// Global UI-layout state — kept separate from CRM domain state.
// Owns: layout mode, notes drawer/panel state, active mobile section,
// sidebar collapsed state (future-ready).
interface UiLayoutContextValue {
  layoutMode: LayoutMode;
  notesOpen: boolean;
  toggleNotes: () => void;
  openNotes: () => void;
  closeNotes: () => void;
  mobileSection: string;
  setMobileSection: (id: string) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const UiLayoutContext = createContext<UiLayoutContextValue | undefined>(undefined);

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

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
  const openNotes = useCallback(() => setNotesOpen(true), []);
  const closeNotes = useCallback(() => setNotesOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarCollapsed((p) => !p), []);

  const value = useMemo<UiLayoutContextValue>(
    () => ({
      layoutMode,
      notesOpen,
      toggleNotes,
      openNotes,
      closeNotes,
      mobileSection,
      setMobileSection,
      sidebarCollapsed,
      toggleSidebar,
    }),
    [
      layoutMode,
      notesOpen,
      toggleNotes,
      openNotes,
      closeNotes,
      mobileSection,
      sidebarCollapsed,
      toggleSidebar,
    ],
  );

  return <UiLayoutContext.Provider value={value}>{children}</UiLayoutContext.Provider>;
};

export const useUiLayout = (): UiLayoutContextValue => {
  const ctx = useContext(UiLayoutContext);
  if (!ctx) throw new Error('useUiLayout must be used within a UiLayoutProvider');
  return ctx;
};
