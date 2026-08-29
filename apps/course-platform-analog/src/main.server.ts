/// <reference types="vite/client" />

import '@angular/platform-server/init';
import 'zone.js/node';

import { enableProdMode, REQUEST as SSR_REQUEST } from '@angular/core';
import {
  bootstrapApplication,
  BootstrapContext,
} from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';

import { ClientRequest, ServerResponse } from 'http';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

if (import.meta.env.PROD) {
  enableProdMode();
}

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(AppComponent, config, context);

export default async function render(
  url: string,
  document: string,
  { req, res }: { req: ClientRequest; res: ServerResponse },
) {
  const html = await renderApplication(bootstrap, {
    document,
    url,
    platformProviders: [
      { provide: SSR_REQUEST, useValue: req },
      { provide: 'RESPONSE', useValue: res },
    ],
  });

  return html;
}
