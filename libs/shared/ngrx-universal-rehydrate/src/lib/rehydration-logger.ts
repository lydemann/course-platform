import { inject, Injectable } from '@angular/core';
import { REHYDRATE_ROOT_CONFIG } from './tokens';
import type { RehydrationRootConfig } from './utils';

@Injectable()
export class RehydrationLogger {
  private readonly config = inject<RehydrationRootConfig>(
    REHYDRATE_ROOT_CONFIG,
  );

  log(msg: string): void {
    if (!this.config.disableWarnings) {
      console.warn(`NgRx Universal Rehydration: ${msg}`);
    }
  }
}
