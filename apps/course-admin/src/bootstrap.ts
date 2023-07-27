import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from '@course-platform/course-admin/shared/domain';

import { AppModule } from '@course-platform/course-admin/shell';

declare global {
  interface Window {
    config: any;
  }
}

if (environment.production) {
  enableProdMode();
}

// load app config
const xhttp = new XMLHttpRequest();
xhttp.open('GET', 'assets/app-config.json', true);
xhttp.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    const config = JSON.parse(this.responseText);
    window.config = config;

    if (environment.production) {
      enableProdMode();
    }

    platformBrowserDynamic()
      .bootstrapModule(AppModule, {
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  }
};
xhttp.send();
