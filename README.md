# Pulse CRM

Config-driven CRM starter built with React, TypeScript, and Vite.

## Features

- Dynamic contact sidebar rendered from JSON configs
- Reusable field renderer system (text, email, phone, address, tags, etc.)
- Mixed conversations panel (email cards + chat bubbles)
- Per-contact notes with add/close panel support
- Responsive 3-column CRM layout with right-side navigation

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/   # UI components (contact, conversations, layout, notes)
├── configs/      # JSON configs for fields, contacts, layout
├── context/      # CRM state (CrmContext)
├── hooks/        # Shared hooks
├── pages/        # Page-level views
├── services/     # Mock API layer
├── types/        # TypeScript interfaces
└── utils/        # Field mapping and formatters
```
