import { HTTPMethod } from '@ngneat/spectator';
import { createHttpFactory, SpectatorHttp } from '@ngneat/spectator/jest';

import {
  CourseResourcesService,
  COURSE_SECTIONS_URL
} from './course-resources.service';

describe('CourseResourcesService', () => {
  let spectator: SpectatorHttp<CourseResourcesService>;
  const createHttp = createHttpFactory(CourseResourcesService);

  beforeEach(() => (spectator = createHttp()));

  it('should test getCourseSections', () => {
    window.config = {
      courseServiceUrl: 'http://localhost:3333'
    };
    spectator.service.getCourseSections().subscribe();
    spectator.expectOne(
      window.config.courseServiceUrl + COURSE_SECTIONS_URL,
      HTTPMethod.GET
    );
  });
});
