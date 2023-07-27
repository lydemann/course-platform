import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { Course } from '@course-platform/shared/interfaces';
import {
  CourseResourcesService,
  GetCoursesResponseDTO,
} from '../resources/course-resources.service';
import {
  createInCache,
  removeFromCache,
} from '../resources/graphql/graphql-helpers';

export const EDIT_COURSE_MUTATION = gql`
  mutation editCourseMutation(
    $id: ID!
    $name: String!
    $description: String!
    $customStyling: String
  ) {
    updateCourse(
      id: $id
      name: $name
      description: $description
      customStyling: $customStyling
    ) {
      id
      name
      description
      customStyling
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

  isEditingCourse$ = new BehaviorSubject(false);

  getCourses(): Observable<Course[]> {
    return this.courseResourcesService.getCourses();
  }

  getCourse(courseId: string): Observable<Course> {
    return this.getCourses().pipe(
      map((courses) => courses.find((course) => course.id === courseId))
    );
  }

  getCourseCustomStyling(courseId: string): Observable<string> {
    return this.getCourse(courseId).pipe(map((course) => course.customStyling));
  }
  editCourseSubmitted(editedCourse: Course) {
    this.isEditingCourse$.next(true);
    return this.apollo
      .mutate<Course>({
        mutation: EDIT_COURSE_MUTATION,
        variables: {
          id: editedCourse.id,
          name: editedCourse.name,
          description: editedCourse.description,
          customStyling: editedCourse.customStyling,
        } as Course,
      })
      .pipe(
        finalize(() => {
          this.isEditingCourse$.next(false);
        })
      );
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
