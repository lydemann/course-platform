import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { CourseClientFacade } from '@course-platform/course-client/shared/domain';
import { SharedModule } from '@course-platform/course-client/shared/ui';
import { CourseFacadeService } from '@course-platform/shared/domain';
import { CourseSection, Lesson } from '@course-platform/shared/interfaces';
import { CourseSidebarComponent } from './components/course-sidebar/course-sidebar.component';
import { ActionItemsComponent } from './containers/action-items/action-items.component';
import { QuestionsComponent } from './containers/questions/questions.component';

@Component({
  selector: 'app-course',
  template: `
    <div
      class="wrapper"
      fxLayout.gt-xs="row"
      fxLayout.lt-sm="column"
      xLayoutAlign="space-between"
    >
      <ng-container *ngIf="isLoading(); else notLoading">
        <app-spinner class="spinner"></app-spinner>
      </ng-container>
      <ng-template #notLoading>
        <app-course-sidebar
          fxFlex.gt-xs="25"
          class="sidebar"
          [sections]="(sections$ | async)!"
          [selectedSection]="(selectedSection$ | async)!"
          [lessons]="(sectionLessons$ | async)!"
          [sectionCompletedPct]="(sectionCompletedPct$ | async)!"
          [selectedLessonId]="(selectedLessonId$ | async)!"
          (lessonSelected)="onLessonSelected($event)"
          (sectionChanged)="onSectionSelected($event)"
        ></app-course-sidebar>

        <div class="content" fxFlex.gt-xs="75">
          <router-outlet></router-outlet>
        </div>
      </ng-template>
    </div>
  `,
  styles: `
  :host {
  display: block;
  width: 100%;

  .wrapper {
    display: flex;
    margin-right: auto;
    margin-left: auto;
    margin-top: 50px;

    .content {
      background: #fefefe;
      padding: 40px;
    }
  }

  .spinner {
    height: 100px;
    width: 100px;
    position: fixed;
    left: 50%;
    margin-left: -50px;
    top: 50%;
    margin-top: -50px;
  }
}
  `,
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    ActionItemsComponent,
    QuestionsComponent,
    CourseSidebarComponent,
  ],
})
export class CourseLayoutComponent implements OnInit, OnDestroy {
  sections$: Observable<CourseSection[]> = this.courseClientFacade.sections$;
  isLoading = this.courseClientFacade.isLoading;
  selectedSection$: Observable<CourseSection> =
    this.courseClientFacade.selectedSection$;
  selectedLessonId$: Observable<string> =
    this.courseClientFacade.selectedLessonId$;
  sectionLessons$: Observable<Lesson[]> =
    this.courseClientFacade.sectionLessons$;
  sectionCompletedPct$: Observable<number> =
    this.courseClientFacade.sectionCompletedPct$;
  courseCustomStyle$: Observable<string> =
    this.courseClientFacade.courseId$.pipe(
      switchMap((courseId) =>
        this.courseFacade.getCourseCustomStyling(courseId)
      )
    );
  styleElement: unknown;
  destroy$ = new Subject<void>();

  constructor(
    private courseClientFacade: CourseClientFacade,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private courseFacade: CourseFacadeService
  ) {}

  ngOnDestroy(): void {
    if (this.styleElement) {
      this.renderer.removeChild(
        this.elementRef.nativeElement,
        this.styleElement
      );
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.courseCustomStyle$
      .pipe(
        takeUntil(this.destroy$),
        filter((style) => !!style)
      )
      .subscribe((style) => {
        const sanitizedStyle =
          this.sanitizer.sanitize(SecurityContext.STYLE, style) ?? '';
        this.createStyle(sanitizedStyle);
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
