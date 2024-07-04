/// <reference types="vite/client" />
import { TextDecoder, TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any;

global.fetch = jest.fn().mockImplementation(() => ({}));

import 'jest-preset-angular/setup-jest';
