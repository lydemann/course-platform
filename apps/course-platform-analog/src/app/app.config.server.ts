import {
  ApplicationConfig,
  importProvidersFrom,
  mergeApplicationConfig,
} from '@angular/core';
import {
  provideServerRendering,
  ɵSERVER_CONTEXT as SERVER_CONTEXT,
} from '@angular/platform-server';
import { NgrxUniversalRehydrateServerModule } from '@course-platform/shared/ngrx-universal-rehydrate/server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    { provide: SERVER_CONTEXT, useValue: 'ssr-analog' },
    importProvidersFrom([NgrxUniversalRehydrateServerModule.forServer()]),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
