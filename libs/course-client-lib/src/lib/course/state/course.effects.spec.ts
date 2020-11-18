import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  createServiceFactory,
  SpectatorService,
  SpyObject
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';

import { CourseResourcesService } from '@course-platform/shared/data-access';
import { UserService } from '@course-platform/shared/feat-auth';
import { CourseSection } from '@course-platform/shared/interfaces';
import { CourseActions } from './course.actions';
import { CourseEffects } from './course.effects';
import { CourseSelectors } from './course.selectors';

describe('CourseEffects', () => {
  let spectator: SpectatorService<CourseEffects>;
  let actions$: Actions;
  let courseResourcesService: SpyObject<CourseResourcesService>;
  let userService: SpyObject<UserService>;
  const createService = createServiceFactory({
    service: CourseEffects,
    mocks: [CourseResourcesService, Router, UserService],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({
        selectors: [{ selector: CourseSelectors.selectCourseId, value: '123' }]
      })
    ]
  });

  beforeEach(() => {
    spectator = createService();
    courseResourcesService = spectator.inject(CourseResourcesService);
    userService = spectator.inject(UserService);
  });

  describe('fetchCourseSections', () => {
    it('should fetch sections', () => {
      const courseSections = [{ id: '1' }] as CourseSection[];

      userService.getCurrentUser.andReturn(of({}));
      courseResourcesService.getCourseSections.andReturn(
        cold('a|', { a: courseSections })
      );

      actions$ = hot('a', { a: CourseActions.courseInitiated });

      const expected = cold('a', {
        a: CourseActions.getCourseSectionsSuccess({ courseSections })
      });
      expect(spectator.service.fetchCourseSections$).toBeObservable(expected);
    });

    it('should handle error', () => {
      const error = { error: 'some error' } as HttpErrorResponse;

      courseResourcesService.getCourseSections.andReturn(throwError(error));

      actions$ = hot('a', { a: CourseActions.courseInitiated });

      const expected = cold('a', {
        a: CourseActions.getCourseSectionsFailed({ error })
      });
      expect(spectator.service.fetchCourseSections$).toBeObservable(expected);
    });
  });
});
