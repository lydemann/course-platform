import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { CourseAdminFacadeService } from '@course-platform/course-admin-lib';

@Injectable({ providedIn: 'root' })
export class SectionAdminResolver implements Resolve<any> {
  constructor(private courseAdminFacadeService: CourseAdminFacadeService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const sectionId = route.params.sectionId;
    this.courseAdminFacadeService.sectionInit(sectionId);
    return;
  }
}
