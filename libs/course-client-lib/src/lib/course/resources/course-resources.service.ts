import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { from, Observable } from 'rxjs';

import { CourseSection, Lesson } from '@course-platform/shared/interfaces';

export const COURSE_SECTIONS_URL = '/api/sections';

@Injectable({
  providedIn: 'root'
})
export class CourseResourcesService {
  constructor(private fireDB: AngularFireDatabase) {}

  getCourseSections(): Observable<CourseSection[]> {
    return this.fireDB.list<CourseSection>('sections').valueChanges();
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
