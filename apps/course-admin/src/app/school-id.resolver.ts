import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { CourseAdminFacadeService } from '@course-platform/course-admin-lib';

@Injectable({ providedIn: 'root' })
export class SchoolIdResolver implements Resolve<null> {
  constructor(private courseAdminFacadeService: CourseAdminFacadeService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<null> | Promise<null> | null {
    const schoolId = route.params.schoolId;
    this.courseAdminFacadeService.setSchoolId(schoolId);
    return;
  }
}
