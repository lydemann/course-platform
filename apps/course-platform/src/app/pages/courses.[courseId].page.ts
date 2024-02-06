import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RedirectToCourseResolver } from '@course-platform/course-client/feature';

export const routeMeta: RouteMeta = {
  title: '',
  resolve: [RedirectToCourseResolver],
  providers: [],
};

@Component({
  standalone: true,
  imports: [],
  template: ``,
})
export default class CoursesRedirectComponent {}
