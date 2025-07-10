import { HttpErrorResponse } from '@angular/common/http';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { throwError } from 'rxjs';
/// <reference types="vite/client" />

import {
  CourseResourcesService,
  CourseResourcesTrpcService,
} from '@course-platform/shared/domain';
import { CourseSection } from '@course-platform/shared/interfaces';
import { CourseActions } from './course.actions';
import { CourseEffects } from './course.effects';
import { CourseSelectors } from './course.selectors';
import {
  SpectatorService,
  SpyObject,
  createServiceFactory,
  createSpyObject,
} from '@ngneat/spectator/jest';
import { Router } from '@angular/router';

describe('CourseEffects', () => {
  let spectator: SpectatorService<CourseEffects>;
  let actions$: Actions;
  let courseResourcesService: SpyObject<CourseResourcesService>;
  const createService = createServiceFactory({
    service: CourseEffects,
    mocks: [CourseResourcesTrpcService, Router],
    providers: [
      {
        provide: CourseResourcesService,
        useValue: createSpyObject(CourseResourcesTrpcService),
      },
      provideMockActions(() => actions$),
      provideMockStore({
        selectors: [{ selector: CourseSelectors.selectCourseId, value: '123' }],
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    courseResourcesService = spectator.inject(CourseResourcesService);
  });

  describe('fetchCourseSections', () => {
    it('should fetch sections', () => {
      const courseSections = [{ id: '1' }] as CourseSection[];

      courseResourcesService.getCourseSections.andReturn(
        cold('a|', { a: courseSections })
      );

      actions$ = hot('a', { a: CourseActions.courseInitiated });

      const expected = cold('a', {
        a: CourseActions.getCourseSectionsSuccess({ courseSections }),
      });
      expect(spectator.service.fetchCourseSections$).toBeObservable(expected);
    });

    it('should handle error', () => {
      const error = { error: 'some error' } as HttpErrorResponse;

      courseResourcesService.getCourseSections.andReturn(throwError(error));

      actions$ = hot('a', { a: CourseActions.courseInitiated });

      const expected = cold('a', {
        a: CourseActions.getCourseSectionsFailed({ error }),
      });
      expect(spectator.service.fetchCourseSections$).toBeObservable(expected);
    });
  });
});
