import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { auth } from 'firebase';
import { filter, first } from 'rxjs/operators';

import { CourseFacadeService } from '@course-platform/course-client-lib';

@Injectable({ providedIn: 'root' })
export class RedirectToCourseResolver implements Resolve<Observable<void>> {
  constructor(
    private router: Router,
    private courseFacadeService: CourseFacadeService
  ) {}

  resolve(route: ActivatedRouteSnapshot): any {
    const courseId = route.params.courseId;
    this.courseFacadeService.loadSections(courseId);
    return this.courseFacadeService.sections$
      .pipe(
        filter(sections => !!sections && sections.length > 0),
        first()
      )
      .subscribe(sections => {
        this.router.navigate([
          auth().tenantId,
          'course',
          courseId,
          sections[0].id,
          sections[0].lessons[0].id
        ]);
      });
  }
}
