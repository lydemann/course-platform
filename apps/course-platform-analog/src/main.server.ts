/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @nx/enforce-module-boundaries */
import '@angular/platform-server/init';
import 'zone.js/node';

import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { REQUEST as SSR_REQUEST } from 'ngx-cookie-service-ssr';
// eslint-disable-next-line @nx/enforce-module-boundaries

import admin, { ServiceAccount } from 'firebase-admin';
import { ClientRequest, ServerResponse } from 'http';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

if (import.meta.env.PROD) {
  enableProdMode();
}

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default async function render(
  url: string,
  document: string,
  { req, res }: { req: ClientRequest; res: ServerResponse }
) {
  if (!admin.apps.length) {
    try {
      const serviceAccount = require('../../../serviceAccountKey.json');
      if (serviceAccount) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as ServiceAccount),
        });
      } else {
        admin.initializeApp();
      }
    } catch (error) {
      admin.initializeApp();
    }
  }

  const html = await renderApplication(bootstrap, {
    document,
    url,
    platformProviders: [
      { provide: SSR_REQUEST, useValue: req },
      { provide: 'RESPONSE', useValue: res },
    ],
  });

  res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=1200');
  res.setHeader('expires', '600');

  return html;
}
