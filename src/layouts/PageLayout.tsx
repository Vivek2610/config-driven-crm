import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { memo } from 'react';

import { NavBar } from '@/components/layout';
import { useUiLayout } from '@/context';
import type { LayoutDefinition, LayoutSection } from '@/types';

import { MobileBottomNav } from './MobileBottomNav';
import { ResponsiveDrawer } from './ResponsiveDrawer';
import { SectionRenderer } from './SectionRenderer';
import { useLayoutRenderer } from './useLayoutRenderer';

interface PageLayoutProps {
  config: LayoutDefinition;
}

// Generic, config-driven page layout. Reads layout.json via useLayoutRenderer
// and renders the right shell for the current breakpoint:
//
//   - desktop  → 3-column flex workspace + right NavBar rail
//   - tablet   → 2-column flex (sidebar + main) + right NavBar + slide-over Notes drawer
//   - mobile   → single page (stacked sections) + bottom nav + bottom-sheet drawers
//
// PageLayout has zero CRM-specific knowledge — all panels come from the registry.
export const PageLayout = memo(({ config }: PageLayoutProps) => {
  const layout = useLayoutRenderer(config);
  const { mode } = layout;

  if (mode === 'mobile') return <MobileShell layout={layout} />;
  return <DesktopShell layout={layout} />;
});

PageLayout.displayName = 'PageLayout';

/* ── Desktop / Tablet shell ────────────────────────────────────────────── */

interface ShellProps {
  layout: ReturnType<typeof useLayoutRenderer>;
}

const DesktopShell = memo(({ layout }: ShellProps) => {
  const { notesOpen, closeNotes } = useUiLayout();
  const { inlineSections, drawerSections, drawer, navPosition, containerType } = layout;

  const containerClass =
    containerType === 'flex'
      ? 'flex flex-1 gap-5 overflow-hidden'
      : containerType === 'grid'
        ? 'grid flex-1 grid-cols-12 gap-5 overflow-hidden'
        : 'flex flex-1 flex-col gap-5 overflow-hidden';

  const notesDrawerSection = drawerSections.find((s) => s.id === 'notes');

  // For inline-mode notes (desktop), filter by notesOpen so the NavBar toggle works.
  const visibleInlineSections = inlineSections.filter(
    (s) => s.id !== 'notes' || notesOpen,
  );

  return (
    <div className="flex h-full w-full flex-1 gap-4 overflow-hidden">
      <div className={containerClass}>
        {visibleInlineSections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>

      {navPosition === 'right' && <NavBar />}

      {/* Drawer-mode notes for tablet */}
      {notesDrawerSection && (
        <ResponsiveDrawer
          open={notesOpen}
          onClose={closeNotes}
          position={drawer?.position ?? 'right'}
          width={drawer?.width}
          height={drawer?.height}
          overlay={drawer?.overlay ?? true}
          ariaLabel="Notes"
        >
          <SectionRenderer section={notesDrawerSection} bare />
        </ResponsiveDrawer>
      )}
    </div>
  );
});
DesktopShell.displayName = 'DesktopShell';

/* ── Mobile shell ──────────────────────────────────────────────────────── */

const MobileShell = memo(({ layout }: ShellProps) => {
  const { mobileSection, notesOpen, closeNotes } = useUiLayout();
  const { pageSections, drawerSections, drawer, defaultSection } = layout;
  const prefersReducedMotion = useReducedMotion();

  const activeId = mobileSection || defaultSection || pageSections[0]?.id;
  const activeSection: LayoutSection | undefined =
    pageSections.find((s) => s.id === activeId) ?? pageSections[0];
  const notesDrawerSection = drawerSections.find((s) => s.id === 'notes');

  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
      {/* Animated page section — only the active one renders */}
      <div className="relative flex-1 overflow-hidden bg-white">
        <AnimatePresence mode="wait" initial={false}>
          {activeSection && (
            <motion.div
              key={activeSection.id}
              className="absolute inset-0 flex min-h-0 flex-col overflow-hidden p-3"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            >
              <SectionRenderer section={activeSection} bare />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MobileBottomNav />

      {/* Notes — bottom sheet on mobile */}
      {notesDrawerSection && (
        <ResponsiveDrawer
          open={notesOpen}
          onClose={closeNotes}
          position={drawer?.position ?? 'bottom'}
          width={drawer?.width}
          height={drawer?.height}
          overlay={drawer?.overlay ?? true}
          ariaLabel="Notes"
        >
          <SectionRenderer section={notesDrawerSection} bare />
        </ResponsiveDrawer>
      )}
    </div>
  );
});
MobileShell.displayName = 'MobileShell';
