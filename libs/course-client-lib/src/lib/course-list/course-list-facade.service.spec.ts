import {
  createServiceFactory,
  SpectatorService,
  SpyObject
} from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

import { CourseSection } from '@course-platform/shared/interfaces';
import { CourseListFacadeService } from './course-list-facade.service';
import { CourseListResourcesService } from './resources/course-list-resources.service';
import { CourseListActions } from './state/course-list.actions';
import { CourseListSelectors } from './state/course-list.selectors';

describe('CourseListFacadeService', () => {
  let spectator: SpectatorService<CourseListFacadeService>;
  let courseListResourcesService: SpyObject<CourseListResourcesService>;
  let store: MockStore;
  const createService = createServiceFactory({
    service: CourseListFacadeService,
    mocks: [CourseListResourcesService],
    providers: [provideMockStore({ initialState: {} })]
  });

  beforeEach(() => {
    spectator = createService();
    courseListResourcesService = spectator.inject(CourseListResourcesService);
    store = (spectator.inject(Store) as unknown) as MockStore;
    spyOn(store, 'dispatch');
    store.overrideSelector(CourseListSelectors.selectCourseSections, []);
    store.overrideSelector(CourseListSelectors.selectIsLoading, false);
  });

  describe('fetchSections', () => {
    it('should fetch sections', () => {
      const courseSections = [{ id: '1' } as CourseSection];
      courseListResourcesService.getCourseSections.andReturn(
        of(courseSections)
      );

      spectator.service.fetchSections();

      expect(store.dispatch).toHaveBeenCalledWith(
        CourseListActions.fetchCourseSections()
      );
    });
  });
});
