import { ActivatedRouteSnapshot } from '@angular/router';
import {
  createServiceFactory,
  SpectatorService,
  SpyObject
} from '@ngneat/spectator/jest';

import { CourseFacadeService } from '@course-platform/course-client-lib';
import { CourseResolver } from './course.resolver';

describe('CourseResolver', () => {
  let spectator: SpectatorService<CourseResolver>;
  let courseFacadeService: SpyObject<CourseFacadeService>;
  const createService = createServiceFactory({
    service: CourseResolver,
    mocks: [CourseFacadeService]
  });

  beforeEach(() => {
    spectator = createService();
    courseFacadeService = spectator.inject(CourseFacadeService);
  });

  it('should fetch sections', () => {
    spectator.service.resolve({
      params: {
        selectedSectionId: '0',
        selectedLessonId: '0'
      }
    } as any);

    expect(courseFacadeService.courseInitiated).toHaveBeenCalled();
  });
});
