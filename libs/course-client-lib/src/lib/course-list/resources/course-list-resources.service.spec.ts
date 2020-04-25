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
    spectator.service.getCourseSections().subscribe();
    spectator.expectOne(COURSE_SECTIONS_URL, HTTPMethod.GET);
  });
});
