import { CourseListFacadeService } from '@course-platform/course-client-lib';
import {
  createServiceFactory,
  SpectatorService,
  SpyObject
} from '@ngneat/spectator/jest';

import { CourseResolver } from './course.resolver';

describe('CourseResolver', () => {
  let spectator: SpectatorService<CourseResolver>;
  let courseListFacadeService: SpyObject<CourseListFacadeService>;
  const createService = createServiceFactory({
    service: CourseResolver,
    mocks: [CourseListFacadeService]
  });

  beforeEach(() => {
    spectator = createService();
    courseListFacadeService = spectator.inject(CourseListFacadeService);
  });

  it('should fetch sections', () => {
    spectator.service.resolve(null);

    expect(courseListFacadeService.fetchSections).toHaveBeenCalled();
  });
});
