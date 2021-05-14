import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { CourseClientFacade } from '@course-platform/course-client-lib';

@Injectable({ providedIn: 'root' })
export class CourseResolver implements Resolve<null> {
  constructor(private courseFacadeService: CourseClientFacade) {}

  resolve(route: ActivatedRouteSnapshot): null {
    this.courseFacadeService.courseInitiated();

    return;
  }
}
