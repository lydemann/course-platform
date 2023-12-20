import {
  createServiceFactory,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';

import { CourseClientFacade } from '@course-platform/course-client/shared/domain';
import { CourseResolver } from './course.resolver';

describe('CourseResolver', () => {
  let spectator: SpectatorService<CourseResolver>;
  let courseFacadeService: SpyObject<CourseClientFacade>;
  const createService = createServiceFactory({
    service: CourseResolver,
    mocks: [CourseClientFacade],
  });

  beforeEach(() => {
    spectator = createService();
    courseFacadeService = spectator.inject(CourseClientFacade);
  });

  it('should fetch sections', () => {
    spectator.service.resolve({
      params: {
        selectedSectionId: '0',
        selectedLessonId: '0',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    expect(courseFacadeService.courseInitiated).toHaveBeenCalled();
  });
});
