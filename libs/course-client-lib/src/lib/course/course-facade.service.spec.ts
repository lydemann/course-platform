import {
  createServiceFactory,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { CourseResourcesService } from '@course-platform/shared/data-access';
import { CourseSection } from '@course-platform/shared/interfaces';
import { CourseClientFacade } from './course-facade.service';
import { CourseActions } from './state/course.actions';
import { CourseSelectors } from './state/course.selectors';

describe('CourseFacadeService', () => {
  let spectator: SpectatorService<CourseClientFacade>;
  let courseResourcesService: SpyObject<CourseResourcesService>;
  let store: MockStore;
  const createService = createServiceFactory({
    service: CourseClientFacade,
    mocks: [CourseResourcesService],
    providers: [provideMockStore({ initialState: {} })],
  });

  beforeEach(() => {
    spectator = createService();
    courseResourcesService = spectator.inject(CourseResourcesService);
    store = spectator.inject(Store) as unknown as MockStore;
    jest.spyOn(store, 'dispatch');
    store.overrideSelector(CourseSelectors.selectSections, []);
    store.overrideSelector(CourseSelectors.selectIsLoadingSections, false);
  });

  describe('courseInitiated', () => {
    it('should dispatch course initiated event', () => {
      const courseSections = [{ id: '1' } as CourseSection];
      courseResourcesService.getCourseSections.andReturn(of(courseSections));

      spectator.service.courseInitiated();

      expect(store.dispatch).toHaveBeenCalledWith(
        CourseActions.courseInitiated()
      );
    });
  });
});
