// Centralized config exports for config-driven rendering.
import type { LayoutDefinition } from '@/types';

import contactData from './contactData.json';
import contactFields from './contactFields.json';
import conversations from './conversations.json';
import layoutJson from './layout.json';
import layoutDefaultJson from './layout.default.json';
import layoutLeftNavJson from './layout.left-nav.json';
import notes from './notes.json';

// Active layout profile — swap the import below to preview a different layout:
//   layoutJson          → left NavBar + Contacts | Conversations + notes drawer (active)
//   layoutDefaultJson   → original default (nav right, 3 inline columns)
//   layoutLeftNavJson   → left NavBar + Conversations | Contacts + notes drawer
const layout = layoutJson as LayoutDefinition;

export {
  contactData,
  contactFields,
  conversations,
  layout,
  layoutDefaultJson as layoutDefault,
  layoutLeftNavJson as layoutLeftNav,
  notes,
};
