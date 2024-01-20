import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RedirectIfAuthenticatedResolver } from '@course-platform/course-client/shared/domain';

export const routeMeta: RouteMeta = {
  title: 'Course Platform',
  resolve: [RedirectIfAuthenticatedResolver],
  providers: [],
};

@Component({
  selector: 'course-platform-home',
  standalone: true,
  imports: [],
  template: ` <h3>Welcome to course platform</h3> `,
})
export default class HomeComponent {}
