import {
  createServiceFactory,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

import { Course } from '@course-platform/shared/interfaces';
import { CourseResourcesService } from '../resources/course-resources.service';
import {
  CourseFacadeService,
  CREATE_COURSE_MUTATION,
  DELETE_COURSE_MUTATION,
  EDIT_COURSE_MUTATION,
} from './course-facade.service';

describe('CourseFacadeService', () => {
  let spectator: SpectatorService<CourseFacadeService>;
  let courseResourcesService: SpyObject<CourseResourcesService>;
  let controller: ApolloTestingController;
  const createService = createServiceFactory({
    service: CourseFacadeService,
    imports: [ApolloTestingModule],
    mocks: [CourseResourcesService],
  });

  beforeEach(() => {
    spectator = createService();
    courseResourcesService = spectator.inject(CourseResourcesService);
    controller = spectator.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  describe('getCourses', () => {
    it('should get courses', () => {
      const courses = [];
      courseResourcesService.getCourses.andReturn(of(courses));
      spectator.service
        .getCourses()
        .pipe(first())
        .subscribe((coursesFromService) => {
          expect(coursesFromService).toBe(courses);
        });
    });
  });

  describe('editCourseSubmitted', () => {
    it('should edit course', () => {
      const editedCourse = {
        id: '1',
        name: 'Some new name',
        description: 'Some new description',
      } as Course;
      spectator.service.editCourseSubmitted(editedCourse).subscribe();

      const operation = controller.expectOne(EDIT_COURSE_MUTATION);

      const variables = operation.operation.variables as Course;
      expect(variables).toEqual(editedCourse);
    });
  });

  describe('createCourseSubmitted', () => {
    it('should create course', () => {
      const courseToCreate = {
        name: 'Some new name',
        description: 'Some new description',
      } as Course;
      spectator.service.createCourseSubmitted(courseToCreate).subscribe();

      const operation = controller.expectOne(CREATE_COURSE_MUTATION);

      const variables = operation.operation.variables as Course;
      expect(variables).toEqual(courseToCreate);
    });
  });

  describe('deleteCourseSubmitted', () => {
    it('should delete course', () => {
      const id = '1';
      spectator.service.deleteCourseSubmitted(id).subscribe();

      const operation = controller.expectOne(DELETE_COURSE_MUTATION);

      const variables = operation.operation.variables as Course;
      expect(variables).toEqual({ id });
    });
  });
});
