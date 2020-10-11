import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { forkJoin, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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

export interface GetCourseSectionsResponse {
  courseSections: CourseSection[];
}

@Injectable({
  providedIn: 'root'
})
export class CourseResourcesService {
  constructor(private fireStore: AngularFirestore, private apollo: Apollo) {}

  getCourseSections(): Observable<GetCourseSectionsResponse> {
    return this.apollo
      .watchQuery<GetCourseSectionsResponse>({
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
            user(uid: "lTHwHBgyQ7nCCSrk47Qt") {
              completedLessons {
                lessonId
                completed
              }
            }
          }
        `
      })
      .valueChanges.pipe(
        map(data => {
          // TODO: update lessons with completed lessons
          return {
            courseSections: data.data.courseSections
          };
        })
      );
  }

  getCourseLessons(sectionId: string): Observable<Lesson[]> {
    return this.fireStore
      .collection<CourseSectionDTO>('sections')
      .doc<CourseSectionDTO>(sectionId)
      .valueChanges()
      .pipe(
        switchMap(courseSection =>
          forkJoin(
            courseSection.lessons.map(lesson =>
              from(lesson.get().then(snapshot => snapshot.data())).pipe(
                getPopulatedLessonOperator()
              )
            )
          )
        )
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

  setCompleteActionItem(
    isCompleted: boolean,
    resourceId: string,
    userId: string
  ): Observable<void> {
    return from(
      this.fireStore
        .collection('users')
        .doc(userId)
        .collection('completedActionItems')
        .doc(resourceId)
        .set({
          completed: isCompleted,
          time: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
        })
    );
  }
}
