import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, TrackByFunction, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { CourseAdminFacadeService } from '@course-platform/course-admin/shared/domain';
import { CourseSection } from '@course-platform/shared/interfaces';
import { CreateLessonModalComponent } from './components/create-lesson-modal/create-lesson-modal.component';
import { CreateSectionModalComponent } from './components/create-section-modal/create-section-modal.component';

@Component({
  selector: 'app-course-admin',
  templateUrl: './course-admin.component.html',
  styleUrls: ['./course-admin.component.scss'],
  standalone: false,
})
export class CourseAdminComponent {
  sections!: Signal<CourseSection[] | undefined>;
  currentCourseId!: Signal<string | null | undefined>;
  sections$: Observable<CourseSection[]>;
  currentCourseId$: Observable<string | null>;
  constructor(
    private courseAdminFacadeService: CourseAdminFacadeService,
    private dialog: MatDialog,
  ) {
    this.sections$ = this.courseAdminFacadeService.sections$;
    this.currentCourseId$ = this.courseAdminFacadeService.currentCourseId$;
    this.sections = toSignal(this.sections$);
    this.currentCourseId = toSignal(this.currentCourseId$);
  }

  getLessonUrl(sectionId: string, lessonId: string) {
    const url = `lesson-admin/${sectionId}/${lessonId}`;
    return url;
  }

  trackBy: TrackByFunction<CourseSection> = (
    _: number,
    item: CourseSection,
  ) => {
    return item.id;
  };

  onCreateLessonClicked(sectionId: string) {
    const dialogRef = this.dialog.open(CreateLessonModalComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((lessonName) => {
      if (lessonName) {
        this.courseAdminFacadeService.createLesson(sectionId, lessonName);
      }
    });
  }

  drop(
    event: CdkDragDrop<string[]>,
    section: CourseSection,
    currentCourseId: string,
  ) {
    moveItemInArray(section.lessons, event.previousIndex, event.currentIndex);
    this.courseAdminFacadeService.moveLesson(
      section.id,
      event.previousIndex,
      event.currentIndex,
      currentCourseId,
    );
  }

  onCreateSectionClicked(event: Event) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(CreateSectionModalComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((sectionName) => {
      if (sectionName) {
        this.courseAdminFacadeService.createSectionSubmitted(sectionName);
      }
    });
  }
}
