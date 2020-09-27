import {
  createServiceFactory,
  SpectatorService,
  SpyObject
} from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { CourseSection } from '@course-platform/shared/interfaces';
import { CourseFacadeService } from './course-facade.service';
import { CourseResourcesService } from './resources/course-resources.service';
import { CourseActions } from './state/course.actions';
import { CourseSelectors } from './state/course.selectors';

describe('CourseFacadeService', () => {
  let spectator: SpectatorService<CourseFacadeService>;
  let courseResourcesService: SpyObject<CourseResourcesService>;
  let store: MockStore;
  const createService = createServiceFactory({
    service: CourseFacadeService,
    mocks: [CourseResourcesService],
    providers: [provideMockStore({ initialState: {} })]
  });

  beforeEach(() => {
    spectator = createService();
    courseResourcesService = spectator.inject(CourseResourcesService);
    store = (spectator.inject(Store) as unknown) as MockStore;
    spyOn(store, 'dispatch');
    store.overrideSelector(CourseSelectors.selectCourseSections, []);
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
