import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { auth } from 'firebase';
import { filter, first } from 'rxjs/operators';

import { CourseClientFacade } from '@course-platform/course-client-lib';

@Injectable({ providedIn: 'root' })
export class RedirectToCourseResolver implements Resolve<Observable<void>> {
  constructor(
    private router: Router,
    private courseFacadeService: CourseClientFacade
  ) {}

  resolve(route: ActivatedRouteSnapshot): any {
    const courseId = route.params.courseId;
    const sectionId = route.params.sectionId;
    const lessonId = route.params.lessonId;
    this.courseFacadeService.loadSections(courseId);
    this.courseFacadeService.sections$
      .pipe(
        filter(
          (sections) =>
            !!sections &&
            sections.length > 0 &&
            !!courseId &&
            !!auth().tenantId &&
            !lessonId &&
            !sectionId
        ),
        first()
      )
      .subscribe((sections) => {
        this.router.navigate([
          'courses',
          courseId,
          sections[0].id,
          sections[0].lessons[0].id,
        ]);
      });

    return true;
  }
}
