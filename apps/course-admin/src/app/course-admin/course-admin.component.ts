import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { CourseAdminFacadeService } from '@course-platform/course-admin-lib';
import { CourseSection } from '@course-platform/shared/interfaces';
import { CreateLessonModalComponent } from './components/create-lesson-modal/create-lesson-modal.component';
import { CreateSectionModalComponent } from './components/create-section-modal/create-section-modal.component';

@Component({
  selector: 'app-course-admin',
  templateUrl: './course-admin.component.html'
})
export class CourseAdminComponent implements OnInit {
  panelOpenState = false;
  sections$: Observable<CourseSection[]>;
  constructor(
    private courseAdminFacadeService: CourseAdminFacadeService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.sections$ = this.courseAdminFacadeService.sections$;
  }

  onLessonClicked(sectionId: string, lessonId: string) {
    this.router.navigate(['course-admin', 'lesson-admin', sectionId, lessonId]);
  }

  onCreateLessonClicked(sectionId: string) {
    const dialogRef = this.dialog.open(CreateLessonModalComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(lessonName => {
      if (lessonName) {
        this.courseAdminFacadeService.createLessonSubmitted(
          sectionId,
          lessonName
        );
      }
    });
  }

  onSectionClicked(event: Event, sectionId: string) {
    event.stopPropagation();

    this.router.navigate(['course-admin', 'section-admin', sectionId]);
  }

  onCreateSectionClicked(event: Event) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(CreateSectionModalComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(sectionName => {
      if (sectionName) {
        this.courseAdminFacadeService.createSectionSubmitted(sectionName);
      }
    });
  }
}
