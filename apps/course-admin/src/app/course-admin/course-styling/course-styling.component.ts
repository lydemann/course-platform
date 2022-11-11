import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { CourseAdminFacadeService } from '@course-platform/course-admin-lib';
import { CourseFacadeService } from '@course-platform/shared/data-access';
import { Course } from '@course-platform/shared/interfaces';
import { ToastService } from '@course-platform/shared/ui';

@Component({
  selector: 'app-course-styling',
  templateUrl: './course-styling.component.html',
  styleUrls: ['./course-styling.component.scss'],
})
export class CourseStylingComponent implements OnInit {
  course$: Observable<Course>;
  courseName$: Observable<string>;
  customStylingFormControl$: Observable<UntypedFormControl>;
  isEditingCourse$: Observable<boolean>;

  constructor(
    private courseAdminFacade: CourseAdminFacadeService,
    private courseFacade: CourseFacadeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.course$ = this.courseAdminFacade.currentCourseId$.pipe(
      switchMap((courseId) => this.courseFacade.getCourse(courseId))
    );
    this.courseName$ = this.course$.pipe(map((course) => course.name));
    this.customStylingFormControl$ = this.course$.pipe(
      map((course) => new UntypedFormControl(course.customStyling, []))
    );
    this.isEditingCourse$ = this.courseFacade.isEditingCourse$;
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
