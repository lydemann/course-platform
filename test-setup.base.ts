/// <reference types="vite/client" />
import { TextDecoder, TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any;

// Add ReadableStream polyfill for Jest
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = class ReadableStream {
    constructor() {
      // Mock implementation
    }
  } as any;
}

// Add other missing Node.js APIs
if (typeof global.TransformStream === 'undefined') {
  global.TransformStream = class TransformStream {
    constructor() {
      // Mock implementation
    }
  } as any;
}

if (typeof global.WritableStream === 'undefined') {
  global.WritableStream = class WritableStream {
    constructor() {
      // Mock implementation
    }
  } as any;
}

global.fetch = jest.fn().mockImplementation(() => ({}));

import 'jest-preset-angular/setup-jest';
