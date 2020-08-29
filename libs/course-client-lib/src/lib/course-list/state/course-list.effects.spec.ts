import { HttpErrorResponse } from '@angular/common/http';
import {
  createServiceFactory,
  SpectatorService,
  SpyObject
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { throwError } from 'rxjs';

import { CourseSection } from '@course-platform/shared/interfaces';
import { CourseListResourcesService } from '../resources/course-list-resources.service';
import { CourseListActions } from './course-list.actions';
import { CourseListEffects } from './course-list.effects';

describe('CourseListEffects', () => {
  let spectator: SpectatorService<CourseListEffects>;
  let actions$: Actions;
  let courseListResourcesService: SpyObject<CourseListResourcesService>;
  const createService = createServiceFactory({
    service: CourseListEffects,
    mocks: [CourseListResourcesService],
    providers: [provideMockActions(() => actions$)]
  });

  beforeEach(() => {
    spectator = createService();
    courseListResourcesService = spectator.inject(CourseListResourcesService);
  });

  describe('fetchCourseSections', () => {
    it('should fetch sections', () => {
      const courseSections = [{ id: '1' }] as CourseSection[];

      courseListResourcesService.getCourseSections.andReturn(
        cold('a|', { a: courseSections })
      );

      actions$ = hot('a', { a: CourseListActions.fetchCourseSections });

      const expected = cold('a', {
        a: CourseListActions.fetchCourseSectionsSuccess({ courseSections })
      });
      expect(spectator.service.fetchCourseSections$).toBeObservable(expected);
    });

    it('should handle error', () => {
      const error = { error: 'some error' } as HttpErrorResponse;

      courseListResourcesService.getCourseSections.andReturn(throwError(error));

      actions$ = hot('a', { a: CourseListActions.fetchCourseSections });

      const expected = cold('a', {
        a: CourseListActions.fetchCourseSectionsFailed({ error })
      });
      expect(spectator.service.fetchCourseSections$).toBeObservable(expected);
    });
  });
});
