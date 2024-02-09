import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { redirectIfLoggedInServerGuard } from '@course-platform/course-client/shared/domain';

export const routeMeta: RouteMeta = {
  title: 'Course Platform',
  canActivate: [redirectIfLoggedInServerGuard],
  providers: [],
};

@Component({
  selector: 'course-platform-home',
  standalone: true,
  imports: [],
  template: `
    <h3 class="text-center text-red-800 mt-10">Welcome to course platform</h3>
  `,
})
export default class HomeComponent {}
