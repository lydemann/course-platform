import { Injectable, NgZone, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, first } from 'rxjs/operators';

import { CourseClientFacade } from '@course-platform/course-client/shared/domain';

@Injectable({ providedIn: 'root' })
export class RedirectToCourseResolver implements Resolve<void> {
  constructor(
    private router: Router,
    private courseFacadeService: CourseClientFacade
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const courseId = route.params['courseId'];
    const sectionId = route.params['sectionId'];
    const lessonId = route.params['lessonId'];
    this.courseFacadeService.loadSections(courseId);
    this.courseFacadeService.sections$
      .pipe(
        filter(
          (sections) =>
            !!sections &&
            sections.length > 0 &&
            !!courseId &&
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
  }
}

export const redirectToCourseResolver: ResolveFn<void> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const courseFacadeService = inject(CourseClientFacade);
  const ngZone = inject(NgZone);
  const courseId = route.params['courseId'];
  const sectionId = route.params['sectionId'];
  const lessonId = route.params['lessonId'];
  courseFacadeService.loadSections(courseId);
  courseFacadeService.sections$
    .pipe(
      filter(
        (sections) =>
          !!sections &&
          sections.length > 0 &&
          !!courseId &&
          !lessonId &&
          !sectionId
      ),
      first()
    )
    .subscribe((sections) => {
      ngZone.run(() => {
        router.navigate([
          'courses',
          courseId,
          sections[0].id,
          sections[0].lessons[0].id,
        ]);
      });
    });
};
