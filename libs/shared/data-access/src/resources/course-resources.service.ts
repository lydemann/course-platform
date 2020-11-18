import { Injectable } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { UserService } from '@course-platform/shared/feat-auth';
import {
  Course,
  CourseSection,
  Lesson
} from '@course-platform/shared/interfaces';

export const COURSE_SECTIONS_URL = '/api/sections';

export interface CourseSectionDTO {
  id: string;
  name: string;
  lessons: DocumentReference[];
}

export interface LessonDTO {
  id: string;
  name: string;
  videoUrl: string;
  description: string;
  resources: DocumentReference[];
  // set by client
  isCompleted?: boolean;
}

export interface CompletedLessonData {
  lessonId: string;
  completed: boolean;
  lastUpdated: boolean;
}

export interface GetCourseSectionsResponseDTO {
  courseSections: CourseSection[];
  user: {
    completedLessons: CompletedLessonData[];
  };
}

export interface GetCoursesResponseDTO {
  course: Course[];
}

export const courseSectionsQuery = gql`
  query GetCourseSectionsQuery($uid: ID!, $courseId: ID!) {
    courseSections(uid: $uid, courseId: $courseId) {
      id
      name
      theme
      lessons {
        id
        name
        description
        videoUrl
        resources {
          name
          id
          url
          type
        }
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
`;

@Injectable({
  providedIn: 'root'
})
export class CourseResourcesService {
  constructor(private apollo: Apollo, private userService: UserService) {}

  getCourses(): Observable<Course[]> {
    const coursesQuery = gql`
      query getCourses {
        course {
          id
          name
        }
      }
    `;

    return this.apollo
      .watchQuery<GetCoursesResponseDTO>({ query: coursesQuery })
      .valueChanges.pipe(
        map(({ data }) => {
          return data.course;
        })
      );
  }

  getCourseSections(courseId: string): Observable<CourseSection[]> {
    return this.userService.getCurrentUser().pipe(
      switchMap(user => {
        return this.apollo
          .watchQuery<GetCourseSectionsResponseDTO>({
            query: courseSectionsQuery,
            variables: {
              uid: user.uid,
              courseId
            }
          })
          .valueChanges.pipe(
            map(({ data }) => {
              const updatedSections = data.courseSections.map(section => {
                const completedLessonsMap = data.user.completedLessons.reduce(
                  (prev, cur) => {
                    if (!cur.completed) {
                      return { ...prev };
                    }

                    return { ...prev, [cur.lessonId]: true };
                  },
                  {}
                );
                return {
                  ...section,
                  lessons: section.lessons.map(lesson => ({
                    ...lesson,
                    isCompleted: completedLessonsMap[lesson.id]
                  }))
                };
              });
              return updatedSections;
            })
          );
      })
    );
  }

  setCompleteLesson(
    isCompleted: boolean,
    lessonId: string,
    userId: string
  ): Observable<any> {
    const completedLessonMutation = gql`
      mutation {
        setLessonCompleted(
          isCompleted: ${isCompleted}
          lessonId: "${lessonId}"
          uid:"${userId}"
          )
      }
    `;

    return this.apollo.mutate({ mutation: completedLessonMutation });
  }

  createLesson(
    sectionId: string,
    sectionName: string = '',
    courseId: string
  ): Observable<string> {
    const createLessonMutation = gql`
      mutation {
        createLesson(courseId: "${courseId}", sectionId: "${sectionId}", name: "${sectionName}")
      }
    `;

    return this.userService.getCurrentUser().pipe(
      switchMap(user => {
        return this.apollo
          .mutate<string>({
            mutation: createLessonMutation,
            refetchQueries: [
              { query: courseSectionsQuery, variables: { uid: user.uid } }
            ]
          })
          .pipe(map(({ data }) => data));
      })
    );
  }

  updateLesson(lesson: Lesson, courseId: string) {
    const updateLessonMutation = gql`
      mutation updateLessonMutation($resources: [LessonResourceInput]) {
        updateLesson(courseId: "${courseId}", id: "${lesson.id}", name: "${lesson.name}", description: "${lesson.description}", videoUrl: "${lesson.videoUrl}", resources: $resources)
      }
    `;

    return this.userService.getCurrentUser().pipe(
      switchMap(user => {
        return this.apollo.mutate({
          mutation: updateLessonMutation,
          variables: {
            resources: lesson.resources
          },
          refetchQueries: [
            { query: courseSectionsQuery, variables: { uid: user.uid } }
          ]
        });
      })
    );
  }

  deleteLesson(sectionId: string, lessonId: string, courseId: string) {
    const deleteLessonMutation = gql`
    mutation {
      deleteLesson(courseId: ${courseId}, sectionId: "${sectionId}", id: "${lessonId}")
    }
  `;
    return this.userService.getCurrentUser().pipe(
      switchMap(user => {
        return this.apollo.mutate({
          mutation: deleteLessonMutation,
          refetchQueries: [
            { query: courseSectionsQuery, variables: { uid: user.uid } }
          ]
        });
      })
    );
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

    return this.userService.getCurrentUser().pipe(
      switchMap(user => {
        return this.apollo.mutate({
          mutation: setActionItemCompletedMutation,
          variables: {
            uid: user.uid
          },
          refetchQueries: [
            { query: courseSectionsQuery, variables: { uid: user.uid } }
          ]
        });
      })
    );
  }

  createSection(sectionName: string, courseId: string) {
    const createSectionMutation = gql`
      mutation createSectionMutation($sectionName: String!, $courseId: ID!) {
        createSection(name: $sectionName, courseId: $courseId)
      }
    `;

    return this.apollo.mutate({
      mutation: createSectionMutation,
      variables: {
        sectionName,
        courseId
      },
      refetchQueries: [
        {
          query: courseSectionsQuery,
          variables: { uid: this.userService.currentUser$.value.uid }
        }
      ]
    });
  }

  updateSection(
    sectionId: string,
    sectionName: string,
    sectionTheme: string,
    courseId: string
  ) {
    const updateSectionMutation = gql`
      mutation updateSectionMutation(
        $sectionId: ID!
        $sectionName: String
        $sectionTheme: String
        courseId: ID!
      ) {
        updateSection(id: $sectionId, name: $sectionName, theme: $sectionTheme, courseId: $courseId)
      }
    `;

    return this.apollo.mutate({
      mutation: updateSectionMutation,
      variables: {
        sectionId,
        sectionName,
        sectionTheme,
        courseId
      },
      refetchQueries: [
        {
          query: courseSectionsQuery,
          variables: { uid: this.userService.currentUser$.value.uid }
        }
      ]
    });
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
        courseId
      },
      refetchQueries: [
        {
          query: courseSectionsQuery,
          variables: { uid: this.userService.currentUser$.value.uid }
        }
      ]
    });
  }
}
