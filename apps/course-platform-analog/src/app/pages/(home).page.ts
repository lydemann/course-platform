import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { authGuard } from '@course-platform/course-client/shared/domain';

export const routeMeta: RouteMeta = {
  title: 'Course Platform',
  canActivate: [authGuard('courses')],
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
