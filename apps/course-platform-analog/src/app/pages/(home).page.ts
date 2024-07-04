import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { authSBGuard } from '@course-platform/shared/auth/domain';

export const routeMeta: RouteMeta = {
  title: 'Course Platform',
  canActivate: [authSBGuard('courses')],
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
