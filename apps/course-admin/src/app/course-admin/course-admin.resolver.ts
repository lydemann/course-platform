import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { CourseAdminFacadeService } from '@course-platform/course-admin-lib';

@Injectable({ providedIn: 'root' })
export class CourseAdminResolver implements Resolve<null> {
  constructor(private courseAdminFacadeService: CourseAdminFacadeService) {}

  resolve(route: ActivatedRouteSnapshot): null {
    this.courseAdminFacadeService.fetchCourseSectionsAndLessons();
    return;
  }
}
