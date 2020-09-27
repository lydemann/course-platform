import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { CourseFacadeService } from '@course-platform/course-client-lib';

@Injectable({ providedIn: 'root' })
export class CourseResolver implements Resolve<null> {
  constructor(private courseFacadeService: CourseFacadeService) {}

  resolve(route: ActivatedRouteSnapshot): null {
    this.courseFacadeService.courseInitiated({
      selectedSectionId: route.params.selectedSectionId
    });

    return;
  }
}
