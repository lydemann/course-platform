import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { forkJoin, from, Observable, of } from 'rxjs';
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
const getPopulatedLessonsOperator = () => {
  return switchMap(getPopulatedLessons);
};

@Injectable({
  providedIn: 'root'
})
export class CourseResourcesService {
  constructor(private fireStore: AngularFirestore) {}

  getCourseSections(): Observable<any> {
    return from(
      this.fireStore
        .collection<CourseSectionDTO>('sections', query => query.orderBy('id'))
        .valueChanges()
        .pipe(
          switchMap(sections => {
            const sections$ = sections.map(section =>
              forkJoin(
                section.lessons.map(lesson =>
                  from(lesson.get().then(doc => doc.data()))
                )
              ).pipe(
                getPopulatedLessonsOperator(),
                map(lessonsForSection => {
                  return {
                    ...section,
                    lessons: lessonsForSection
                  } as CourseSection;
                })
              )
            );

            const toReturn = forkJoin(sections$);
            return toReturn;
          })
        )
    );
  }

  getLesson(lessonId: string): Observable<Lesson> {
    forkJoin([of('')]).pipe(map(data => data));

    return this.fireStore
      .collection<Lesson>('lessons')
      .doc<Lesson>(lessonId)
      .valueChanges();
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
  ): Observable<void> {
    return from(
      this.fireStore
        .collection('users')
        .doc(userId)
        .collection('userLessonsCompleted')
        .doc(lessonId)
        .set({
          completed: isCompleted,
          lessonId: lessonId,
          time: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
        })
    );
  }
  getCompletedLessons(userId: string): Observable<CompletedLesson[]> {
    return this.fireStore
      .collection('users')
      .doc(userId)
      .collection<CompletedLesson>('userLessonsCompleted')
      .valueChanges();
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
