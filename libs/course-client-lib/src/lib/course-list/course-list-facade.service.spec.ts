import { CourseSection } from '@course-platform/shared/interfaces';
import {
  createServiceFactory,
  SpectatorService,
  SpyObject
} from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

import { CourseListFacadeService } from './course-list-facade.service';
import { CourseListResourcesService } from './resources/course-list-resources.service';

describe('CourseListFacadeService', () => {
  let spectator: SpectatorService<CourseListFacadeService>;
  let courseListResourcesService: SpyObject<CourseListResourcesService>;
  const createService = createServiceFactory({
    service: CourseListFacadeService,
    mocks: [CourseListResourcesService]
  });

  beforeEach(() => {
    spectator = createService();
    courseListResourcesService = spectator.inject(CourseListResourcesService);
  });

  describe('fetchSections', () => {
    it('should fetch sections', done => {
      const courseSections = [{ id: '1' } as CourseSection];
      courseListResourcesService.getCourseSections.andReturn(
        of(courseSections)
      );

      spectator.service.fetchSections();

      expect(courseListResourcesService.getCourseSections).toHaveBeenCalled();

      spectator.service.sections$.pipe(first()).subscribe(sections => {
        expect(sections).toEqual(courseSections);
        done();
      });
    });
  });
});
