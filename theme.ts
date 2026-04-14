// theme.ts — Single source of truth for all visual parameters
// Edit values here to adjust puzzle/tray appearance across the app.

// --- Breakpoints ---
export const BREAKPOINT = 640; // px, matches Tailwind 'sm'

// --- Connector (puzzle tab/slot) Dimensions ---
export const CONNECTOR = {
  mobile: { tabSize: 20, protrusion: 10 },   // w-5 h-5, right-[-10px]
  desktop: { tabSize: 28, protrusion: 14 },   // w-7 h-7, right-[-14px]
};

// --- Font ---
export const FONT = {
  family: '"Fredoka", sans-serif',
  weight: 700,
  mobile: { base: 14, min: 10 },
  desktop: { base: 20, min: 16 },
  trayTitle: { mobile: 10, desktop: 12 },
};

// --- Puzzle Piece Padding & Sizing ---
export const PIECE = {
  // These are the "extra" px added to measured text width per piece
  // (left/right padding + buffer for border-radius + connector space)
  mobile: { padding: 28, minWidth: 55 },
  desktop: { padding: 80, minWidth: 120 },
  defaultMinWidth: 80,
};

// --- Tray Container ---
export const TRAY = {
  mobile: { padding: 8, gap: 12 },   // p-2, gap-3
  desktop: { padding: 16, gap: 16 }, // p-4, gap-4
};

// --- CEFR Level Colors ---
export const LEVEL_COLORS: Record<string, string> = {
  A1: '#2CA18C',
  A2: '#2b83ba',
  B1: '#FF916B',
  B2: '#C14364',
};

// --- Colors ---
export const COLORS = {
  aux:  { active: '#fb923c', inactive: '#fed8aa', text: '#9b3412', textActive: '#ffffff', trayBg: '#ffedd5' },
  verb: { active: '#0ca5e9', inactive: '#bae6fe', text: '#036aa2', textActive: '#ffffff', trayBg: '#e1f3fe' },
  feedback: { correct: '#22c55e', incorrect: '#EF4135' },
};

// --- Dynamic Font Scaling ---
// Scale font based on container width relative to reference widths
export const SCALING = {
  mobile: { refWidth: 375 },   // iPhone SE width
  desktop: { refWidth: 800 },  // typical desktop panel
};
