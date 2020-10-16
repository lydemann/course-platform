import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(
    private courseResourcesService: CourseResourcesService,
    private router: Router
  ) {
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

  lessonInit(sectionId: string, lessonId: string) {
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

  saveLessonClicked(lesson: Lesson) {
    this.courseResourcesService.updateLesson(lesson).subscribe();
  }

  createLessonClicked(sectionId: string) {
    // TODO: Open modal for setting lesson name, create and navigate to newly created lesson
    this.courseResourcesService.createLesson(sectionId).subscribe();
  }

  deleteLessonClicked(sectionId: string, lessonId: string) {
    this.courseResourcesService
      .deleteLesson(sectionId, lessonId)
      .subscribe(() => {
        this.router.navigate(['course-admin']);
      });
  }
}
