import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

import {
  CourseResourcesService,
  GetCoursesResponseDTO,
} from '@course-platform/shared/data-access';
import { Course } from '@course-platform/shared/interfaces';
import { ToastService } from '@course-platform/shared/ui';
import { createInCache, removeFromCache } from '../graphql-helpers';

export const EDIT_COURSE_MUTATION = gql`
  mutation editCourseMutation($id: ID!, $name: String!, $description: String!) {
    updateCourse(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const CREATE_COURSE_MUTATION = gql`
  mutation createCourseMutation($name: String!, $description: String!) {
    createCourse(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const DELETE_COURSE_MUTATION = gql`
  mutation deleteCourseMutation($id: ID!) {
    deleteCourse(id: $id) {
      id
      name
      description
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CourseFacadeService {
  constructor(
    private apollo: Apollo,
    private courseResourcesService: CourseResourcesService
  ) {}

  getCourses(): Observable<Course[]> {
    return this.courseResourcesService.getCourses();
  }

  editCourseSubmitted(editedCourse: Course) {
    return this.apollo.mutate<Course>({
      mutation: EDIT_COURSE_MUTATION,
      variables: {
        id: editedCourse.id,
        name: editedCourse.name,
        description: editedCourse.description,
      } as Course,
    });
  }

  createCourseSubmitted(course: Course) {
    const getCoursesQuery = this.courseResourcesService.GET_COURSES_QUERY;

    return this.apollo.mutate<{ createCourse: Course }>({
      mutation: CREATE_COURSE_MUTATION,
      variables: {
        name: course.name,
        description: course.description,
      } as Course,
      update(cache, { data }) {
        createInCache<GetCoursesResponseDTO>(
          data?.createCourse,
          getCoursesQuery,
          cache,
          'course'
        );
      },
    });
  }

  deleteCourseSubmitted(courseId: string) {
    const getCoursesQuery = this.courseResourcesService.GET_COURSES_QUERY;

    // TODO: uodate ui
    return this.apollo.mutate<{ deleteCourse: Course }>({
      mutation: DELETE_COURSE_MUTATION,
      variables: {
        id: courseId,
      } as Course,
      update(cache, { data }) {
        removeFromCache<GetCoursesResponseDTO>(
          data.deleteCourse,
          getCoursesQuery,
          cache,
          'course'
        );
      },
    });
  }
}
