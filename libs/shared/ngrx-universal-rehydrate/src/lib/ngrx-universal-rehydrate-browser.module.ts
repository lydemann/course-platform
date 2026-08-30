import { isPlatformServer } from '@angular/common';
import {
  inject,
  ModuleWithProviders,
  NgModule,
  PLATFORM_ID,
  TransferState,
} from '@angular/core';

import { META_REDUCERS, Store } from '@ngrx/store';
import { browserRehydrateReducer } from './reducers';
import { RehydrationLogger } from './rehydration-logger';
import { RehydrateStoreModule, addSlice } from './store';
import { FEATURE_STORES, REHYDRATE_ROOT_CONFIG } from './tokens';
import { RehydrationRootConfig, defaultRehydrationRootConfig } from './utils';

@NgModule({
  imports: [RehydrateStoreModule],
})
export class NgrxUniversalRehydrateBrowserRootModule {
  private readonly rootConfig = inject<RehydrationRootConfig>(
    REHYDRATE_ROOT_CONFIG,
  );
  private readonly platformId = inject(PLATFORM_ID);
  private readonly store = inject(Store);

  constructor() {
    /*
     * If we are on the server then we need to add the slices defined at root
     * to the store so they can be transferred
     */
    if (isPlatformServer(this.platformId)) {
      this.store.dispatch(addSlice({ slices: this.rootConfig.stores ?? [] }));
    }
  }
}

@NgModule({})
export class NgrxUniversalRehydrateBrowserFeatureModule {
  private readonly stores = inject<string[]>(FEATURE_STORES);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly store = inject(Store);

  constructor() {
    if (isPlatformServer(this.platformId))
      this.store.dispatch(addSlice({ slices: this.stores }));
  }
}

@NgModule({})
export class NgrxUniversalRehydrateBrowserModule {
  static forRoot(
    config: Partial<RehydrationRootConfig>,
  ): ModuleWithProviders<NgrxUniversalRehydrateBrowserRootModule> {
    return {
      ngModule: NgrxUniversalRehydrateBrowserRootModule,
      providers: [
        {
          provide: REHYDRATE_ROOT_CONFIG,
          useValue: {
            ...defaultRehydrationRootConfig,
            ...config,
          },
        },
        {
          provide: META_REDUCERS,
          deps: [PLATFORM_ID, TransferState, REHYDRATE_ROOT_CONFIG],
          useFactory: browserRehydrateReducer,
          multi: true,
        },
        RehydrationLogger,
      ],
    };
  }

  static forFeature(
    stores: RehydrationRootConfig['stores'],
  ): ModuleWithProviders<NgrxUniversalRehydrateBrowserFeatureModule> {
    return {
      ngModule: NgrxUniversalRehydrateBrowserFeatureModule,
      providers: [
        {
          provide: FEATURE_STORES,
          useValue: stores,
          multi: true,
        },
      ],
    };
  }
}
