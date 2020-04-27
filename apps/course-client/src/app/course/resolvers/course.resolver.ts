import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CourseListFacadeService } from '@course-platform/course-client-lib';

@Injectable({ providedIn: 'root' })
export class CourseResolver implements Resolve<null> {
  constructor(private courseListFacadeService: CourseListFacadeService) {}

  resolve(route: ActivatedRouteSnapshot): null {
    this.courseListFacadeService.fetchSections();

    return;
  }
}
