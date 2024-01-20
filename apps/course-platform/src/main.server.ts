import '@angular/platform-server/init';
import 'zone.js/node';

import { InjectionToken, enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';

import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

if (import.meta.env.PROD) {
  enableProdMode();
}

const bootstrap = () => bootstrapApplication(AppComponent, config);

export const REQUEST = new InjectionToken<Request>('REQUEST');
export const RESPONSE = new InjectionToken<Response>('RESPONSE');

export default async function render(
  url: string,
  document: string,
  { req, res }: { req: Request; res: Response }
) {
  const html = await renderApplication(bootstrap, {
    document,
    url,
    platformProviders: [
      { provide: REQUEST, useValue: req },
      { provide: RESPONSE, useValue: res },
    ],
  });
  return html;
}
