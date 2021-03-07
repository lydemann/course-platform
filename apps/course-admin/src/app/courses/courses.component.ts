import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { Observable } from 'rxjs';

import { CourseFacadeService } from '@course-platform/course-admin-lib';
import { Course } from '@course-platform/shared/interfaces';
import { CourseModalComponent } from './course-modal/course-modal/course-modal.component';
import { DeleteCourseModalComponent } from './course-modal/delete-course-modal/delete-course-modal.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  courses$: Observable<Course[]>;

  constructor(
    private courseFacadeService: CourseFacadeService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.courses$ = this.courseFacadeService.getCourses();
  }

  courseSelected(courseId) {
    this.router.navigate([auth().tenantId, 'course-admin', courseId]);
  }

  onCreateCourseClick() {
    const dialogRef = this.dialog.open(CourseModalComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((createdCourse: Course) => {
      if (createdCourse) {
        this.courseFacadeService.createCourseSubmitted(createdCourse);
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
        this.courseFacadeService.editCourseSubmitted(editedCourse);
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
        this.courseFacadeService.deleteCourseSubmitted(courseToDelete.id);
      }
    });
  }
}
