import { isPlatformServer } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

import { CourseClientFacade } from '@course-platform/course-client/shared/domain';

@Injectable({ providedIn: 'root' })
export class CourseResolver implements Resolve<null> {
  constructor(private courseFacadeService: CourseClientFacade) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): null {
    courseResolver(route, state);

    return null;
  }
}

export const courseResolver: ResolveFn<null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const courseFacadeService = inject(CourseClientFacade);

  courseFacadeService.courseInitiated();

  return null;
};

export const courseServerResolver: ResolveFn<null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const courseFacadeService = inject(CourseClientFacade);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    courseFacadeService.courseInitiated();
  }

  return null;
};
