import type { ComponentType } from 'react';

import { MainPanel, NotesPanel, Sidebar } from '@/components/layout';

// Component registry — maps `section.component` strings from layout.json to
// real React components. Add new entries here to expose new section types.
// Components consume their dependencies from context (CrmContext / UiLayoutContext),
// so the registry stays generic and free of prop wiring.
export const SECTION_REGISTRY: Record<string, ComponentType> = {
  Sidebar,
  MainPanel,
  NotesPanel,
};

export type SectionComponentKey = keyof typeof SECTION_REGISTRY;

export const getSectionComponent = (key: string): ComponentType | undefined =>
  SECTION_REGISTRY[key];
