import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { CourseResourcesService } from '@course-platform/shared/data-access';
import { CourseSection, Lesson } from '@course-platform/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CourseAdminFacadeService {
  private isLoadingSubject = new BehaviorSubject<Boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private sectionsSubject = new BehaviorSubject<CourseSection[]>([]);
  sections$ = this.sectionsSubject.asObservable();
  currentLesson$ = new BehaviorSubject<Lesson>(null);
  private currentSectionId$ = new BehaviorSubject('');
  private currentLessonId$ = new BehaviorSubject('');
  constructor(private courseResourcesService: CourseResourcesService) {
    combineLatest([
      this.currentSectionId$,
      this.currentLessonId$,
      this.sections$
    ])
      .pipe(
        map(([sectionId, lessonId, sections]) => {
          return sections
            ?.find(section => section.id === sectionId)
            ?.lessons?.find(lesson => lesson.id === lessonId);
        }),
        filter(lesson => !!lesson)
      )
      .subscribe(this.currentLesson$);
  }

  lessonInit(sectionId: any, lessonId: any) {
    this.currentSectionId$.next(sectionId);
    this.currentLessonId$.next(lessonId);
  }

  fetchCourseSections() {
    this.isLoadingSubject.next(true);
    this.courseResourcesService
      .getCourseSections()
      .pipe(
        map(response => response.courseSections),
        tap(() => {
          this.isLoadingSubject.next(false);
        })
      )
      .subscribe(this.sectionsSubject);
  }
}
