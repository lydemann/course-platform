import { RouteMeta } from '@analogjs/router';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { redirectToCourseResolver } from '@course-platform/course-client/feature';

export const routeMeta: RouteMeta = {
  title: '',
  resolve: { redirectToCourseResolver },
};

@Component({
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: ``,
})
export default class CoursesRedirectComponent {}
