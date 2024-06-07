import { Component, signal } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { CourseAdminFacadeService } from '@course-platform/course-admin/shared/domain';
import { Course } from '@course-platform/shared/interfaces';
import { ToastService } from '@course-platform/shared/ui';

@Component({
  selector: 'app-course-styling',
  templateUrl: './course-styling.component.html',
  styleUrls: ['./course-styling.component.scss'],
})
export class CourseStylingComponent {
  course$: Observable<Course>;
  courseName$: Observable<string>;
  customStylingFormControl$: Observable<UntypedFormControl>;
  isEditingCourse = this.courseFacade.isEditingCourse;

  constructor(
    private courseAdminFacade: CourseAdminFacadeService,
    private courseFacade: CourseAdminFacadeService,
    private toastService: ToastService
  ) {
    this.course$ = this.courseAdminFacade.currentCourseId$.pipe(
      switchMap((courseId) => this.courseFacade.getCourse(courseId!))
    );
    this.courseName$ = this.course$.pipe(map((course) => course.name));
    this.customStylingFormControl$ = this.course$.pipe(
      map((course) => new UntypedFormControl(course.customStyling, []))
    );
  }

  submit(customStylingFormControl: UntypedFormControl, course: Course) {
    if (!customStylingFormControl.valid) {
      return false;
    }

    const updatedCourse = {
      ...course,
      customStyling: customStylingFormControl.value || '',
    } as Course;

    this.courseFacade.editCourseSubmitted(updatedCourse).subscribe(() => {
      this.toastService.showSuccessToast({ message: 'Custom styling saved' });
    });
    return false;
  }
}
