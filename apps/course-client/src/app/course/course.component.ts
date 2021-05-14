import {
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, map, pluck, switchMap, takeUntil } from 'rxjs/operators';

import {
  CourseClientFacade,
  selectedSectionIdRouteParam,
} from '@course-platform/course-client-lib';
import { CourseFacadeService } from '@course-platform/shared/data-access';
import { CourseSection, Lesson } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit, OnDestroy {
  sections$: Observable<CourseSection[]>;
  isLoading$: Observable<Boolean>;
  selectedSection$: Observable<CourseSection>;
  selectedLesson$: Observable<Lesson>;
  selectedLessonId$: Observable<string>;
  sectionLessons$: Observable<Lesson[]>;
  sectionCompletedPct$: Observable<number>;
  courseCustomStyle$: Observable<string>;
  styleElement: any;
  destroy$ = new Subject();

  constructor(
    private courseClientFacade: CourseClientFacade,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private courseFacade: CourseFacadeService
  ) {}
  ngOnDestroy(): void {
    this.renderer.removeChild(this.elementRef.nativeElement, this.styleElement);
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.isLoading$ = this.courseClientFacade.isLoading$;
    this.sections$ = this.courseClientFacade.sections$;
    this.selectedSection$ = this.courseClientFacade.selectedSection$;
    this.sectionLessons$ = this.courseClientFacade.sectionLessons$;
    this.selectedLessonId$ = this.courseClientFacade.selectedLessonId$;
    this.sectionCompletedPct$ = this.courseClientFacade.sectionCompletedPct$;
    this.courseCustomStyle$ = this.courseClientFacade.courseId$.pipe(
      switchMap((courseId) =>
        this.courseFacade.getCourseCustomStyling(courseId)
      )
    );

    this.courseCustomStyle$
      .pipe(
        filter((style) => !!style),
        takeUntil(this.destroy$)
      )
      .subscribe((style) => {
        this.createStyle(style);
      });
  }

  private createStyle(style: string): void {
    this.styleElement = this.renderer.createElement('style');
    this.renderer.appendChild(
      this.styleElement,
      document.createTextNode(style)
    );
    this.renderer.appendChild(this.elementRef.nativeElement, this.styleElement);
  }

  onLessonSelected(selectedLessonId: string) {
    this.courseClientFacade.onLessonSelected(selectedLessonId);
  }

  onSectionSelected(selectionSectionId: string) {
    this.courseClientFacade.onSectionSelected(selectionSectionId);
  }
}
