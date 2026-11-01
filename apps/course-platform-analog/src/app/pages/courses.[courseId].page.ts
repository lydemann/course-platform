import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { redirectToCourseResolver } from '@course-platform/course-client/feature';

export const routeMeta: RouteMeta = {
  title: '',
  resolve: { redirectToCourseResolver },
};

@Component({
  imports: [],
  template: ``,
})
export default class CoursesRedirectComponent {}
