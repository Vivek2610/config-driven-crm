import { memo, type ReactNode } from 'react';

import type { LayoutSection } from '@/types';

interface PageLayoutProps {
  sections: LayoutSection[];
  renderSection: (section: LayoutSection) => ReactNode;
}

// Grid layout shell that renders each section based on JSON configuration.
export const PageLayout = memo(({ sections, renderSection }: PageLayoutProps) => (
  <section className="grid grid-cols-12 gap-4">
    {sections.map((section) => (
      <div key={section.id} className={section.className}>
        {renderSection(section)}
      </div>
    ))}
  </section>
));

PageLayout.displayName = 'PageLayout';
