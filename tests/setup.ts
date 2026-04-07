import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// 1. Mock ResizeObserver (Used by TrayGroup)
// Enhanced to trigger the callback immediately so TrayGroup measures > 0 and renders
class ResizeObserverMock {
  callback: ResizeObserverCallback;
  
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    // Simulate a desktop width immediately upon observation
    this.callback([
      {
        target,
        contentRect: {
          width: 800, // Large enough to trigger desktop layout
          height: 500,
          top: 0, left: 0, bottom: 0, right: 0, x: 0, y: 0,
          toJSON: () => {}
        } as DOMRectReadOnly,
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: []
      }
    ], this);
  }
  
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock as any;

// 2. Mock Canvas getContext (Used by measureTextWidth)
// JSDOM doesn't implement layout/rendering, so we mock the measureText function
HTMLCanvasElement.prototype.getContext = vi.fn((contextId: string) => {
  if (contextId === '2d') {
    return {
      font: '',
      measureText: (text: string) => ({
        // Return a fake width based on string length to allow logic testing
        width: text.length * 10 + 20, 
      }),
    } as unknown as CanvasRenderingContext2D;
  }
  return null;
}) as any;

// 3. Mock window.matchMedia (Used for responsive checks)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query === '(min-width: 640px)', // Default to "Desktop" for stable testing
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 4. Suppress specific console warnings if necessary
// console.warn = vi.fn();

// 5. Mock SpeechSynthesis (Used by FeedbackPanel TTS feature)
globalThis.SpeechSynthesisUtterance = vi.fn().mockImplementation(function(this: any, text: string) {
  this.text = text;
  this.lang = '';
  this.voice = null;
});