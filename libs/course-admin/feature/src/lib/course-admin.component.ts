import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { CourseAdminFacadeService } from '@course-platform/course-admin/shared/domain';
import { CourseSection } from '@course-platform/shared/interfaces';
import { CreateLessonModalComponent } from './components/create-lesson-modal/create-lesson-modal.component';
import { CreateSectionModalComponent } from './components/create-section-modal/create-section-modal.component';

@Component({
  selector: 'app-course-admin',
  templateUrl: './course-admin.component.html',
  styleUrls: ['./course-admin.component.scss'],
})
export class CourseAdminComponent implements OnInit {
  panelOpenState = false;
  sections$: Observable<CourseSection[]>;
  currentCourseId$: Observable<string>;
  constructor(
    private courseAdminFacadeService: CourseAdminFacadeService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.sections$ = this.courseAdminFacadeService.sections$;
    this.currentCourseId$ = this.courseAdminFacadeService.currentCourseId$;
  }

  getLessonUrl(sectionId: string, lessonId: string, currentCourseId: string) {
    const url = `/course-admin/${currentCourseId}/lesson-admin/${sectionId}/${lessonId}`;
    return url;
  }

  trackBy(index, item) {
    return item.id;
  }

  onCreateLessonClicked(sectionId: string) {
    const dialogRef = this.dialog.open(CreateLessonModalComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((lessonName) => {
      if (lessonName) {
        this.courseAdminFacadeService.createLessonSubmitted(
          sectionId,
          lessonName
        );
      }
    });
  }

  drop(
    event: CdkDragDrop<string[]>,
    section: CourseSection,
    currentCourseId: string
  ) {
    moveItemInArray(section.lessons, event.previousIndex, event.currentIndex);
    this.courseAdminFacadeService.moveLesson(
      section.id,
      event.previousIndex,
      event.currentIndex,
      currentCourseId
    );
  }

  onSectionClicked(event: Event, sectionId: string, currentCourseId: string) {
    event.stopPropagation();

    this.router.navigate([
      'course-admin',
      currentCourseId,
      'section-admin',
      sectionId,
    ]);
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
