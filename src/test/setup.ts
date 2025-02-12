import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { JSDOM } from "jsdom"
import ResizeObserver from "resize-observer-polyfill"
import "vitest-axe/extend-expect"

vi.mock('../components/ui/toaster', () => ({
  toaster: {
    create: vi.fn(),
  },
}));

// Add missing browser APIs
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

const { window } = new JSDOM()

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock toaster
vi.mock('@/components/ui/toaster', () => ({
  toaster: {
    create: vi.fn(),
  },
}));

// Mock window.fs for file operations
vi.stubGlobal('fs', {
  readFile: vi.fn(),
});

// Add missing browser APIs
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// ResizeObserver mock
vi.stubGlobal("ResizeObserver", ResizeObserver)
window["ResizeObserver"] = ResizeObserver

// IntersectionObserver mock
const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))
vi.stubGlobal("IntersectionObserver", IntersectionObserverMock)
window["IntersectionObserver"] = IntersectionObserverMock

// Scroll Methods mock
window.Element.prototype.scrollTo = () => { }
window.Element.prototype.scrollIntoView = () => { }

// requestAnimationFrame mock
window.requestAnimationFrame = (cb) => setTimeout(cb, 1000 / 60)

// URL object mock
window.URL.createObjectURL = () => "https://i.pravatar.cc/300"
window.URL.revokeObjectURL = () => { }

// navigator mock
Object.defineProperty(window, "navigator", {
  value: {
    clipboard: {
      writeText: vi.fn(),
    },
  },
})

// Override globalThis
Object.assign(global, { window, document: window.document })