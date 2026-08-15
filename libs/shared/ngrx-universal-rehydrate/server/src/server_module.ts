import {
  inject,
  ModuleWithProviders,
  NgModule,
  TransferState,
} from '@angular/core';

import { BEFORE_APP_SERIALIZED } from '@angular/platform-server';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { selectStateToTransfer } from '../../src/lib/store';
import { REHYDRATE_TRANSFER_STATE } from '../../src/lib/tokens';

/**
 *
 * @param store
 * @param transferState
 * @param existing The existing callback for serializing the TransferState
 */
export function serializeRehydrateStateFactory(
  store: Store,
  transferState: TransferState,
  existing: () => void,
) {
  return async () => {
    const state = await store
      .select(selectStateToTransfer)
      .pipe(take(1))
      .toPromise();

    if (state) {
      transferState.set(REHYDRATE_TRANSFER_STATE, state);
    }

    await existing();
  };
}

@NgModule({})
export class NgrxUniversalRehydrateServerModule {
  private readonly callbacks = (inject(BEFORE_APP_SERIALIZED, {
    optional: true,
  }) ?? []) as (() => void | Promise<void>)[];
  private readonly store = inject(Store);
  private readonly transferState = inject(TransferState);

  constructor() {
    /*
     * Register the callback that will store the saved slices into TransferState prior to render
     *
     * As it stands there is only one BEFORE_APP_SERIALIZED callback in the Angular framework.
     * This is the callback to serialize the transfer state (if it exists at all).
     *
     * We are assuming that the first callback is the aforementioned callback, this may break in the future
     * since we are wrapping that callback with our own callback to ensure that the transfer state for rehydration
     * is added to the TransferState before it is serialized
     */
    const serializeStateCallback =
      this.callbacks[0] ||
      // So, so hacky. But currently there is no other way to find the right callback since the functions
      // prototype does not have the name property. Open to ideas here.
      this.callbacks.find((c) => c.toString().includes(`appId + '-state'`));

    if (serializeStateCallback) {
      this.callbacks[0] = serializeRehydrateStateFactory(
        this.store,
        this.transferState,
        serializeStateCallback,
      );
    }
  }

  static forServer(): ModuleWithProviders<NgrxUniversalRehydrateServerModule> {
    return {
      ngModule: NgrxUniversalRehydrateServerModule,
      providers: [],
    };
  }
}
