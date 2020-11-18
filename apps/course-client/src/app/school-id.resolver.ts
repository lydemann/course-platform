import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { CourseFacadeService } from '@course-platform/course-client-lib';

@Injectable({ providedIn: 'root' })
export class SchoolIdResolver implements Resolve<null> {
  constructor(private courseFacadeService: CourseFacadeService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<null> | Promise<null> | null {
    const schoolId = route.params.schoolId;
    this.courseFacadeService.setSchoolId(schoolId);
    return;
  }
}
