import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

import {
  CourseResourcesService,
  GetCoursesResponseDTO,
} from '@course-platform/shared/data-access';
import { Course } from '@course-platform/shared/interfaces';
import { createInCache, removeFromCache } from '../graphql-helpers';

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
    const mutation = gql`
      mutation editCourseMutation(
        $id: ID!
        $name: String!
        $description: String!
      ) {
        updateCourse(id: $id, name: $name, description: $description) {
          id
          name
          description
        }
      }
    `;

    return this.apollo
      .mutate<Course>({
        mutation,
        variables: {
          id: editedCourse.id,
          name: editedCourse.name,
          description: editedCourse.description,
        } as Course,
      })
      .subscribe(() => {
        // TODO: show toast when saved
      });
  }

  createCourseSubmitted(course: Course) {
    const mutation = gql`
      mutation createCourseMutation($name: String!, $description: String!) {
        createCourse(name: $name, description: $description) {
          id
          name
          description
        }
      }
    `;

    const getCoursesQuery = this.courseResourcesService.GET_COURSES_QUERY;

    return this.apollo
      .mutate<{ createCourse: Course }>({
        mutation,
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
      })
      .subscribe(() => {
        // TODO: show toast when created
      });
  }

  deleteCourseSubmitted(courseId: string) {
    const mutation = gql`
      mutation deleteCourseMutation($id: ID!) {
        deleteCourse(id: $id) {
          id
          name
          description
        }
      }
    `;
    const getCoursesQuery = this.courseResourcesService.GET_COURSES_QUERY;

    // TODO: uodate ui
    return this.apollo
      .mutate<{ deleteCourse: Course }>({
        mutation,
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
      })
      .subscribe(() => {
        // TODO: show toast when created
      });
  }
}
