import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { combineLatest, from, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import {
  Course,
  CourseSection,
  Lesson
} from '@course-platform/shared/interfaces';

export const COURSE_SECTIONS_URL = '/api/sections';

interface LessonGroup {
  [sectionId: string]: Lesson[];
}

@Injectable({
  providedIn: 'root'
})
export class CourseResourcesService {
  constructor(private fireDB: AngularFireDatabase) {}

  getCourseSections(): Observable<CourseSection[]> {
    return this.fireDB.list<CourseSection>('sections').valueChanges();
  }

  getLesson(sectionId: string, lessonId: string): Observable<Lesson> {
    return this.fireDB
      .object<Lesson>(`lessons/${sectionId}/${lessonId}`)
      .valueChanges();
  }

  getCourseSectionsWithLessons(): Observable<CourseSection[]> {
    const sections$ = this.fireDB
      .list<CourseSection>('sections')
      .valueChanges();
    const lessonGroups$ = this.fireDB
      .list<LessonGroup>(`lessons`)
      .valueChanges();

    return combineLatest([sections$, lessonGroups$]).pipe(
      first(),
      map(([sections, lessonGroups]) => {
        return sections.map(
          section =>
            ({ ...section, lessons: lessonGroups[section.id] } as CourseSection)
        );
      })
    );
  }

  getCourseLessons(sectionId: string): Observable<Lesson[]> {
    return this.fireDB.list<Lesson>(`lessons/${sectionId}`).valueChanges();
  }

  setCompleteLesson(
    isCompleted: boolean,
    lessonId: string,
    userId: string
  ): Observable<void> {
    return from(
      this.fireDB
        .object(`userInfo/${userId}/completedLessons/${lessonId}`)
        .update({
          isCompleted,
          time: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
        })
    );
  }
  getCompletedLessons(
    userId: string
  ): Observable<{
    [lessonId: string]: { isCompleted: boolean; time: string };
  }> {
    return this.fireDB
      .object<{
        [lessonId: string]: { isCompleted: boolean; time: string };
      }>(`userInfo/${userId}/completedLessons`)
      .valueChanges();
  }

  setCompleteActionItem(
    isComplete: boolean,
    resourceId: string,
    userId: string
  ): Observable<void> {
    return from(
      this.fireDB
        .object(`userInfo/${userId}/completedActionItems/${resourceId}`)
        .update({
          isComplete,
          time: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
        })
    );
  }
}
