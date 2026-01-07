import { beforeEach, vi } from 'vitest';
import '@angular/compiler';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock setTimeout/clearTimeout for timer-based tests
global.setTimeout = vi.fn((fn: () => void, delay?: number) => {
  return setTimeout(fn, delay);
}) as unknown as typeof setTimeout;

global.clearTimeout = vi.fn((id: number | undefined) => {
  return clearTimeout(id);
}) as unknown as typeof clearTimeout;

// Reset localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

