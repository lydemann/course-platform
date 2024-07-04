import { Component } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Home',
  resolve: {
    data: async (route) => {
      // call server load resolver for this route from another resolver
      // const data = toSignal(injectLoad<typeof load>(), { requireSync: true });
      // const data = await getLoadResolver<CoursesServerData>(route);
      return { courses: [] };
    },
  },
};

@Component({
  selector: 'analog-app-home',
  standalone: true,
  imports: [AnalogWelcomeComponent],
  template: `
     <analog-app-analog-welcome/>
  `,
})
export default class HomeComponent {}
