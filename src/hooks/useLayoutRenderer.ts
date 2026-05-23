import { useMemo } from 'react';

import type {
  DesktopLayoutConfig,
  DrawerConfig,
  LayoutDefinition,
  LayoutMode,
  LayoutSection,
  MobileLayoutConfig,
  TabletLayoutConfig,
} from '@/types';

import { useUiLayout } from './useUiLayout';

export interface ResolvedLayout {
  mode: LayoutMode;
  containerType: 'flex' | 'grid' | 'stack';
  navPosition: 'right' | 'left' | 'bottom' | 'top' | 'hidden';
  defaultSection?: string;
  drawer?: DrawerConfig;
  inlineSections: LayoutSection[];
  drawerSections: LayoutSection[];
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

export const useLayoutRenderer = (config: LayoutDefinition): ResolvedLayout => {
  const { layoutMode } = useUiLayout();

  return useMemo(() => {
    const modeConfig = pickModeConfig(config, layoutMode);
    const sections = sortByOrder(modeConfig.sections).filter((s) => s.visible !== false);

    const inlineSections = sections.filter((s) => (s.mode ?? 'inline') === 'inline');
    const drawerSections = sections.filter((s) => s.mode === 'drawer');
    const pageSections = sections.filter((s) => s.mode === 'page');

    const defaultSection =
      'defaultSection' in modeConfig ? modeConfig.defaultSection : undefined;

    return {
      mode: layoutMode,
      containerType: modeConfig.type,
      navPosition: modeConfig.navPosition,
      defaultSection,
      drawer: modeConfig.drawer,
      inlineSections,
      drawerSections,
      pageSections,
    };
  }, [config, layoutMode]);
};
