import { memo, type CSSProperties } from 'react';

import type { LayoutSection } from '@/types';

import { getSectionComponent } from './sectionRegistry';

interface SectionRendererProps {
  section: LayoutSection;
  // Rendered content takes the full available space within its container.
  // `inline` sections render with width/flex from config; drawers/pages set their
  // own outer wrapper, so they pass `bare` to skip the sizing wrapper.
  bare?: boolean;
}

const buildInlineStyle = (section: LayoutSection): CSSProperties => {
  const style: CSSProperties = {};
  if (section.width) style.width = section.width;
  if (section.minWidth !== undefined) style.minWidth = section.minWidth;
  if (section.maxWidth) style.maxWidth = section.maxWidth;
  if (section.height) style.height = section.height;
  if (section.flex !== undefined) style.flex = section.flex;
  return style;
};

// Generic section renderer — looks up the section's component in the registry
// and renders it. Handles inline sizing styles based on layout.json config.
export const SectionRenderer = memo(({ section, bare }: SectionRendererProps) => {
  const Component = getSectionComponent(section.component);

  if (!Component) {
    if (import.meta.env.DEV) {
      console.warn(`[SectionRenderer] Unknown component "${section.component}"`);
    }
    return null;
  }

  if (bare) return <Component />;

  return (
    <div
      data-section-id={section.id}
      className="flex h-full min-h-0 flex-col overflow-hidden"
      style={buildInlineStyle(section)}
    >
      <Component />
    </div>
  );
});

SectionRenderer.displayName = 'SectionRenderer';
