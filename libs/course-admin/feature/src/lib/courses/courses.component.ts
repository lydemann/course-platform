import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { Course } from '@course-platform/shared/interfaces';
import { ToastService } from '@course-platform/shared/ui';
import { CourseModalComponent } from './course-modal/course-modal/course-modal.component';
import { DeleteCourseModalComponent } from './course-modal/delete-course-modal/delete-course-modal.component';
import { CourseAdminFacadeService } from '@course-platform/course-admin/shared/domain';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent {
  courses$: Observable<Course[]> = this.courseAdminFacadeService.getCourses();

  constructor(
    private courseAdminFacadeService: CourseAdminFacadeService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  onCreateCourseClick() {
    const dialogRef = this.dialog.open(CourseModalComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((createdCourse: Course) => {
      if (createdCourse) {
        this.courseAdminFacadeService
          .createCourseSubmitted(createdCourse)
          .subscribe(() => {
            this.toastService.showSuccessToast({ message: 'Course created' });
          });
      }
    });
  }

  onEditCourseClick(course: Course) {
    const dialogRef = this.dialog.open(CourseModalComponent, {
      width: '600px',
      data: course,
    });

    dialogRef.afterClosed().subscribe((editedCourse: Course) => {
      if (editedCourse) {
        this.courseAdminFacadeService
          .editCourseSubmitted(editedCourse)
          .subscribe(() => {
            this.toastService.showSuccessToast({ message: 'Course saved' });
          });
      }
    });
  }

  onDeleteCourseClick(course: Course) {
    const dialogRef = this.dialog.open(DeleteCourseModalComponent, {
      width: '600px',
      data: course,
    });

    dialogRef.afterClosed().subscribe((courseToDelete: Course) => {
      if (courseToDelete) {
        this.courseAdminFacadeService
          .deleteCourseSubmitted(courseToDelete.id)
          .subscribe(() => {
            this.toastService.showSuccessToast({ message: 'Course deleted' });
          });
      }
    });
  }
}
