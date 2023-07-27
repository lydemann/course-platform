import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CourseAdminFacadeService } from '@course-platform/course-admin/shared/domain';


@Injectable({ providedIn: 'root' })
export class CourseAdminResolver implements Resolve<void> {
  constructor(private courseAdminFacadeService: CourseAdminFacadeService) {}

  resolve(route: ActivatedRouteSnapshot): void {
    const courseId = route.params['courseId'];
    this.courseAdminFacadeService.courseAdminInit(courseId);
  }
}
