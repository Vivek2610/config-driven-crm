import { useMemo } from 'react';

import { useUiLayout } from '@/context';
import type {
  DesktopLayoutConfig,
  DrawerConfig,
  LayoutDefinition,
  LayoutMode,
  LayoutSection,
  MobileLayoutConfig,
  TabletLayoutConfig,
} from '@/types';

export interface ResolvedLayout {
  mode: LayoutMode;
  containerType: 'flex' | 'grid' | 'stack';
  navPosition: 'right' | 'left' | 'bottom' | 'top' | 'hidden';
  defaultSection?: string;
  drawer?: DrawerConfig;
  // Sections that participate in the inline flex/stack layout for the current mode.
  inlineSections: LayoutSection[];
  // All sections defined for the current mode regardless of mode (inline/drawer/page).
  allSections: LayoutSection[];
  // Sections marked `mode: drawer` for the current mode.
  drawerSections: LayoutSection[];
  // Sections marked `mode: page` for mobile stack mode.
  pageSections: LayoutSection[];
}

const sortByOrder = (sections: LayoutSection[]): LayoutSection[] =>
  [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const pickModeConfig = (
  config: LayoutDefinition,
  mode: LayoutMode,
): DesktopLayoutConfig | TabletLayoutConfig | MobileLayoutConfig => {
  if (mode === 'mobile') return config.mobile;
  if (mode === 'tablet') return config.tablet;
  return config.desktop;
};

// Reads the raw layout.json + current viewport mode and returns a normalized,
// memoized view that PageLayout can render directly. Preserves order, splits
// sections by render mode (inline / drawer / page), and merges defaults.
export const useLayoutRenderer = (config: LayoutDefinition): ResolvedLayout => {
  const { layoutMode } = useUiLayout();

  return useMemo(() => {
    const modeConfig = pickModeConfig(config, layoutMode);
    const allSections = sortByOrder(modeConfig.sections).filter(
      (s) => s.visible !== false,
    );

    const inlineSections = allSections.filter((s) => (s.mode ?? 'inline') === 'inline');
    const drawerSections = allSections.filter((s) => s.mode === 'drawer');
    const pageSections = allSections.filter((s) => s.mode === 'page');

    const defaultSection =
      'defaultSection' in modeConfig ? modeConfig.defaultSection : undefined;

    return {
      mode: layoutMode,
      containerType: modeConfig.type,
      navPosition: modeConfig.navPosition,
      defaultSection,
      drawer: modeConfig.drawer,
      inlineSections,
      allSections,
      drawerSections,
      pageSections,
    };
  }, [config, layoutMode]);
};
