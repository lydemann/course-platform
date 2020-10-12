import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { forkJoin, from, Observable } from 'rxjs';
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

interface CompletedLesson {
  lessonId: string;
  isCompleted: boolean;
  time: string;
}

const getPopulatedLessons = (lessons: LessonDTO[]) => {
  const populatedLessons$ = lessons.map(lesson => {
    return getPopulatedLesson(lesson);
  });

  return forkJoin(populatedLessons$);
};

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

const getPopulatedLessonOperator = () => {
  return switchMap(getPopulatedLesson);
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
export interface GetCourseSectionsResponse {
  courseSections: CourseSection[];
}

@Injectable({
  providedIn: 'root'
})
export class CourseResourcesService {
  constructor(private apollo: Apollo, private userService: UserService) {}

  getCourseSections(): Observable<GetCourseSectionsResponse> {
    return this.userService.getCurrentUser().pipe(
      switchMap(currentUser => {
        return this.apollo
          .watchQuery<GetCourseSectionsResponseDTO>({
            query: gql`
            {
              courseSections {
                id
                name
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
              }
              user(uid: "${currentUser.uid}") {
                completedLessons {
                  lessonId
                  completed
                  lastUpdated
                }
              }
            }
          `
          })
          .valueChanges.pipe(
            map(data => {
              const updatedSections = data.data.courseSections.map(section => {
                const completedLessonsMap = data.data.user.completedLessons.reduce(
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
              return {
                courseSections: updatedSections
              };
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
}
