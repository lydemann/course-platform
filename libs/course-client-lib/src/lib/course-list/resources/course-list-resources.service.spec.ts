import { HTTPMethod } from '@ngneat/spectator';
import { createHttpFactory, SpectatorHttp } from '@ngneat/spectator/jest';

import {
  CourseListResourcesService,
  COURSE_SECTIONS_URL
} from './course-list-resources.service';

describe('CourseListResourcesService', () => {
  let spectator: SpectatorHttp<CourseListResourcesService>;
  const createHttp = createHttpFactory(CourseListResourcesService);

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
