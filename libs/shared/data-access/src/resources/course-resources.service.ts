import { Injectable } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { forkJoin, from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { UserService } from '@course-platform/shared/feat-auth';
import {
  CourseSection,
  Lesson,
  LessonResource
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

const getPopulatedLesson = (lesson: LessonDTO) => {
  const resourcesPerLesson$ = forkJoin(
    lesson.resources.map(resource =>
      from(resource.get().then(doc => doc.data()))
    )
  );
  return resourcesPerLesson$.pipe(
    map((resources: LessonResource[]) => {
      return {
        ...lesson,
        resources
      } as Lesson;
    })
  );
};

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

export const courseSectionsQuery = gql`
  query GetCourseSectionsQuery($uid: String!) {
    courseSections(uid: $uid) {
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

  getCourseSections(): Observable<CourseSection[]> {
    return this.userService.getCurrentUser().pipe(
      switchMap(user => {
        return this.apollo
          .watchQuery<GetCourseSectionsResponseDTO>({
            query: courseSectionsQuery,
            variables: {
              uid: user.uid
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
    sectionName: string = ''
  ): Observable<string> {
    const createLessonMutation = gql`
      mutation {
        createLesson(sectionId: "${sectionId}", name: "${sectionName}")
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

  updateLesson(lesson: Lesson) {
    const updateLessonMutation = gql`
      mutation {
        updateLesson(id: "${lesson.id}", name: "${lesson.name}", description: "${lesson.description}", videoUrl: "${lesson.videoUrl}")
      }
    `;

    return this.userService.getCurrentUser().pipe(
      switchMap(user => {
        return this.apollo.mutate({
          mutation: updateLessonMutation,
          refetchQueries: [
            { query: courseSectionsQuery, variables: { uid: user.uid } }
          ]
        });
      })
    );
  }

  deleteLesson(sectionId: string, lessonId: string) {
    const deleteLessonMutation = gql`
    mutation {
      deleteLesson(sectionId: "${sectionId}", id: "${lessonId}")
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
          isCompleted: ${completed}
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

  createSection(sectionName: string) {
    const createSectionMutation = gql`
      mutation createSectionMutation($sectionName: String!) {
        createSection(name: $sectionName)
      }
    `;

    return this.apollo.mutate({
      mutation: createSectionMutation,
      variables: {
        sectionName
      },
      refetchQueries: [
        {
          query: courseSectionsQuery,
          variables: { uid: this.userService.currentUser$.value.uid }
        }
      ]
    });
  }

  updateSection(sectionId: string, sectionName: string, sectionTheme: string) {
    const updateSectionMutation = gql`
      mutation updateSectionMutation(
        $sectionId: ID!
        $sectionName: String
        $sectionTheme: String
      ) {
        updateSection(id: $sectionId, name: $sectionName, theme: $sectionTheme)
      }
    `;

    return this.apollo.mutate({
      mutation: updateSectionMutation,
      variables: {
        sectionId,
        sectionName,
        sectionTheme
      },
      refetchQueries: [
        {
          query: courseSectionsQuery,
          variables: { uid: this.userService.currentUser$.value.uid }
        }
      ]
    });
  }
  deleteSection(sectionId: string) {
    const createSectionMutation = gql`
      mutation deleteSectionMutation($sectionId: ID!) {
        deleteSection(id: $sectionId)
      }
    `;

    return this.apollo.mutate({
      mutation: createSectionMutation,
      variables: {
        sectionId
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
