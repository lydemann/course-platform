/// <reference types="vite/client" />
import { TextDecoder, TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any;

import 'jest-preset-angular/setup-jest';
