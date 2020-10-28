import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';

import { CourseFacadeService } from '@course-platform/course-client-lib';

@Injectable({ providedIn: 'root' })
export class RedirectToCourseResolver implements Resolve<Observable<void>> {
  constructor(
    private router: Router,
    private courseFacadeService: CourseFacadeService
  ) {}

  resolve(route: ActivatedRouteSnapshot): any {
    this.courseFacadeService.courseInitiated();
    return this.courseFacadeService.sections$
      .pipe(
        filter(sections => !!sections && sections.length > 0),
        first()
      )
      .subscribe(sections => {
        this.router.navigate([
          'course',
          sections[0].id,
          sections[0].lessons[0].id
        ]);
      });
  }
}
