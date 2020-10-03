import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { CourseAdminFacadeService } from '@course-platform/course-admin-lib';

@Injectable({ providedIn: 'root' })
export class LessonAdminResolver implements Resolve<null> {
  constructor(private courseAdminFacadeService: CourseAdminFacadeService) {}

  resolve(route: ActivatedRouteSnapshot): null {
    const sectionId = route.params.sectionId;
    const lessonId = route.params.lessonId;
    this.courseAdminFacadeService.fetchLesson(sectionId, lessonId);
    return;
  }
}
