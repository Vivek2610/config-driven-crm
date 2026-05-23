// Centralized config exports for config-driven rendering.
import type { LayoutDefinition } from '@/types';

import contactData from './contactData.json';
import contactFields from './contactFields.json';
import conversations from './conversations.json';
import layoutJson from './layout.json';
import notes from './notes.json';

const layout = layoutJson as LayoutDefinition;

export { contactData, contactFields, conversations, layout, notes };
