# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Conjugaison Puzzle is a French verb conjugation learning tool built as a React + TypeScript SPA. Users drag puzzle pieces (stems + endings) to reconstruct verb conjugations across 14 French tenses. Data is served from Supabase (PostgreSQL + JSONB) and generated offline via a Node.js script using Google Gemini API.

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # Production build
npm run test       # Vitest in watch mode
npm run test:run   # Vitest single run (for CI)
npm run test:ui    # Vitest browser UI
npm run deploy     # Build + wrangler deploy to Cloudflare Pages
```

To run a single test file: `npx vitest run tests/path/to/file.test.tsx`

## Architecture

### Component Hierarchy
```
App.tsx (root, game state)
├── GameHeader        — score, controls, language switcher
├── PuzzleBoard       — drop zones for puzzle pieces
│   └── WorkBench     — temporary piece placement
├── SupplyLayout      — tray of available pieces
│   └── SmartTray/TrayGroup — 4 columns: Aux Stem, Aux Ending, Verb Stem, Verb Ending
├── FeedbackPanel     — hints and grammar explanations
└── ControlBar        — game action buttons
```

### Key Hooks
- `hooks/usePuzzleEngine.ts` — puzzle queue, game state machine (loading/playing/success/error), Supabase data fetching
- `hooks/useGameplay.ts` — drag-and-drop logic, puzzle validation, score tracking

### Data Flow
1. `usePuzzleEngine` fetches puzzle batches from Supabase
2. Simple tenses split into stem + ending; compound tenses split into auxiliary (stem+ending) + participle (stem+ending)
3. Irregular verbs may have whole form in stem with null ending
4. Distractor pieces are pre-generated server-side

### Path Alias
`@/*` maps to project root (configured in tsconfig.json and vite.config.ts)

### Localization
Translations in `locales/` supporting fr (default), en, zh, ja.

## Data Pipeline

1. `node scripts/generate_dataset.js` — generate puzzles via Gemini API (needs `API_KEY` env var)
2. `python scripts/jsonToCsv.py` — convert JSON to CSV for Supabase import
3. Import CSVs into Supabase `verbs` and `puzzles` tables

## Environment

Requires `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Testing

- Vitest with jsdom environment, setup in `tests/setup.ts` (mocks for ResizeObserver, Canvas, matchMedia)
- Tests in `tests/` mirror source structure (components/, services/, utils/)
