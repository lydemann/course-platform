/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, from } from 'rxjs';
import { catchError, first, map, switchMap } from 'rxjs/operators';

import {
  Course,
  CourseSection,
  Lesson,
} from '@course-platform/shared/interfaces';
import { courseFragments } from './course-fragments';
import {
  CourseResourcesService,
  CourseSectionDTO,
  GetCourseSectionsResponseDTO,
  GetCoursesResponseDTO,
} from './course-resources.service';
import { AuthFBService } from '@course-platform/shared/auth/domain';

export const courseSectionsQuery = gql`
  query GetCourseSectionsQuery($uid: String!, $courseId: String!) {
    courseSections(uid: $uid, courseId: $courseId) {
      id
      name
      theme
      lessons {
        ...LessonFields
      }
      actionItems {
        id
        isCompleted
        question
        answerDescription
      }
    }
    user(uid: $uid) {
      completedLessons {
        lessonId
        completed
        lastUpdated
      }
    }
  }

  ${courseFragments.lesson}
`;

export const GET_COURSES_QUERY = gql`
  query getCourses {
    course {
      id
      name
      description
      customStyling
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CourseResourcesFbService implements CourseResourcesService {
  private courseId = '';
  constructor(private apollo: Apollo, private authFBService: AuthFBService) {}

  getCourses(): Observable<Course[]> {
    return this.apollo
      .query<GetCoursesResponseDTO>({ query: GET_COURSES_QUERY })
      .pipe(
        map((data) => {
          console.log('getCourses data', data);
          return data?.data?.course || [];
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  getCourseSections(courseId: string): Observable<CourseSection[]> {
    this.courseId = courseId;

    return this.authFBService.getFBUser().pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('No user id found');
        }

        console.log('uid', user.uid);
        return this.apollo
          .query<GetCourseSectionsResponseDTO>({
            query: courseSectionsQuery,
            variables: {
              uid: user.uid,
              courseId,
            },
          })
          .pipe(
            map(({ data }) => {
              console.log('data', data);
              const updatedSections = data.courseSections.map((section) => {
                const completedLessonsMap = data.user.completedLessons.reduce(
                  (prev: Record<string, boolean>, cur) => {
                    if (!cur.completed) {
                      return { ...prev } as Record<string, boolean>;
                    }

                    return { ...prev, [cur.lessonId]: true } as Record<
                      string,
                      boolean
                    >;
                  },
                  {}
                );
                return {
                  ...section,
                  lessons: section.lessons.map((lesson) => ({
                    ...lesson,
                    isCompleted: completedLessonsMap[lesson.id],
                  })),
                };
              });
              return updatedSections;
            }),
            catchError((error) => {
              console.log('error when calling getCourseSections', error);
              throw error;
            })
          );
      })
    );
  }

  setCompleteLesson(isCompleted: boolean, lessonId: string) {
    return from(this.authFBService.getFBUser()).pipe(
      switchMap((user) => {
        const completedLessonMutation = gql`
        mutation {
          setLessonCompleted(
            isCompleted: ${isCompleted}
            lessonId: "${lessonId}"
            uid:"${user?.uid}"
            )
        }
      `;
        return this.apollo.mutate({ mutation: completedLessonMutation });
      })
    );
  }

  createLesson(
    sectionId: string,
    lessonName = '',
    courseId: string
  ): Observable<Lesson> {
    const createLessonMutation = gql`
      mutation {
        createLesson(courseId: "${courseId}", sectionId: "${sectionId}", name: "${lessonName}") {
          ...LessonFields
        }
      }

      ${courseFragments.lesson}
    `;

    return (
      this.apollo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mutate<{ createLesson: Lesson }>({
          mutation: createLessonMutation,
        })
        .pipe(
          map(({ data }) => {
            if (!data) {
              throw new Error('No lesson data received');
            }
            return data.createLesson;
          })
        )
    );
  }

  updateLesson(lesson: Lesson, courseId: string, sectionId: string) {
    const updateLessonMutation = gql`
      mutation updateLessonMutation(
        $courseId: ID!
        $id: ID!
        $name: String
        $description: String
        $videoUrl: String
        $resources: [LessonResourceInput]
        $sectionId: String!
      ) {
        updateLesson(
          courseId: $courseId
          id: $id
          name: $name
          description: $description
          videoUrl: $videoUrl
          resources: $resources
          sectionId: $sectionId
        ) {
          ...LessonFields
        }
      }

      ${courseFragments.lesson}
    `;

    return from(this.authFBService.getFBUser()).pipe(
      first(),
      switchMap((user) =>
        this.apollo.mutate({
          mutation: updateLessonMutation,
          variables: {
            courseId,
            id: lesson.id,
            name: lesson.name,
            description: lesson.description,
            videoUrl: lesson.videoUrl,
            resources: lesson.resources,
            sectionId: sectionId,
          },
        })
      )
    );
  }

  deleteLesson(sectionId: string, lessonId: string, courseId: string) {
    const deleteLessonMutation = gql`
      mutation deleteLessonMutation(
        $courseId: ID!
        $sectionId: String!
        $lessonId: ID!
      ) {
        deleteLesson(courseId: $courseId, sectionId: $sectionId, id: $lessonId)
      }
    `;
    return this.apollo.mutate({
      errorPolicy: 'all',
      mutation: deleteLessonMutation,
      variables: { courseId: this.courseId, sectionId, lessonId },
    });
  }

  setActionItemCompleted(resourceId: string, completed: boolean) {
    const setActionItemCompletedMutation = gql`
      mutation setActionItemCompletedMutation($uid: ID!) {
        setActionItemCompleted(
          uid: $uid
          id: "${resourceId}"
          isCompleted: ${completed},
        )
      }
    `;

    return from(this.authFBService.getFBUser()).pipe(
      switchMap((user) =>
        this.apollo.mutate({
          mutation: setActionItemCompletedMutation,
          variables: {
            uid: user?.uid,
          },
          refetchQueries: [
            {
              query: courseSectionsQuery,
              variables: { uid: user?.uid, courseId: this.courseId },
            },
          ],
        })
      )
    );
  }

  createSection(
    sectionName: string,
    courseId: string
  ): Observable<CourseSectionDTO> {
    const createSectionMutation = gql`
      mutation createSectionMutation($sectionName: String!, $courseId: ID!) {
        createSection(name: $sectionName, courseId: $courseId)
      }
    `;

    return this.apollo
      .mutate<CourseSectionDTO>({
        mutation: createSectionMutation,
        variables: {
          sectionName,
          courseId,
        },
      })
      .pipe(
        map((data) => {
          if (data.errors) {
            throw new Error(data.errors[0].message);
          }

          if (!data.data) {
            throw new Error('No data returned from createSectionMutation');
          }

          return data.data;
        })
      );
  }

  updateSection(
    sectionId: string,
    sectionName: string,
    sectionTheme: string,
    courseId: string
  ): Observable<CourseSectionDTO> {
    const updateSectionMutation = gql`
      mutation updateSectionMutation(
        $sectionId: ID!
        $sectionName: String
        $sectionTheme: String
        $courseId: ID!
      ) {
        updateSection(
          id: $sectionId
          name: $sectionName
          theme: $sectionTheme
          courseId: $courseId
        )
      }
    `;

    return this.apollo
      .mutate<CourseSectionDTO>({
        mutation: updateSectionMutation,
        variables: {
          sectionId,
          sectionName,
          sectionTheme,
          courseId,
        },
      })
      .pipe(
        map((data) => {
          if (data.errors) {
            throw new Error(data.errors[0].message);
          }

          if (!data.data) {
            throw new Error('No data returned from updateSectionMutation');
          }

          return data.data;
        })
      );
  }
  deleteSection(sectionId: string, courseId: string) {
    const createSectionMutation = gql`
      mutation deleteSectionMutation($sectionId: ID!, courseId: ID!) {
        deleteSection(id: $sectionId, courseId: $courseId)
      }
    `;

    return this.apollo.mutate({
      mutation: createSectionMutation,
      variables: {
        sectionId,
        courseId,
      },
    });
  }
}
