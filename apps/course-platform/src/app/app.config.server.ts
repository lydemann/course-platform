import {
  ApplicationConfig,
  importProvidersFrom,
  mergeApplicationConfig,
} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { NgrxUniversalRehydrateServerModule } from '@course-platform/shared/ngrx-universal-rehydrate/server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    importProvidersFrom([NgrxUniversalRehydrateServerModule.forServer()]),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
