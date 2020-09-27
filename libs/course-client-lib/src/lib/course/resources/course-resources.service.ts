import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

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
}
