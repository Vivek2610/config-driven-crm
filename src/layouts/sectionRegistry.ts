import type { ComponentType } from 'react';

import { MainPanel, NotesPanel, Sidebar } from '@/components/layout';

// Component registry — maps `section.component` strings from layout.json to
// real React components. Add new entries here to expose new section types.
const SECTION_REGISTRY: Record<string, ComponentType> = {
  Sidebar,
  MainPanel,
  NotesPanel,
};

export const getSectionComponent = (key: string): ComponentType | undefined =>
  SECTION_REGISTRY[key];
