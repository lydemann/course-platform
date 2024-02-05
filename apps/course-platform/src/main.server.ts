import '@angular/platform-server/init';
import 'zone.js/node';

import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { REQUEST as SSR_REQUEST } from 'ngx-cookie-service-ssr';
// eslint-disable-next-line @nx/enforce-module-boundaries
import serviceAccount from '../../../serviceAccountKey.json';

import {
  REQUEST_TOKEN,
  RESPONSE_TOKEN,
} from '@course-platform/shared/ssr/domain';
import admin, { ServiceAccount } from 'firebase-admin';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

if (import.meta.env.PROD) {
  enableProdMode();
}

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default async function render(
  url: string,
  document: string,
  { req, res }: { req: Request; res: Response }
) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
  }

  const html = await renderApplication(bootstrap, {
    document,
    url,
    platformProviders: [
      { provide: REQUEST_TOKEN, useValue: req },
      { provide: SSR_REQUEST, useValue: req },
      { provide: RESPONSE_TOKEN, useValue: res },
      { provide: 'RESPONSE', useValue: res },
    ],
  });
  return html;
}
