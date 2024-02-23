import { Component, Inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Course } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-course-modal',
  templateUrl: './course-modal.component.html',
  styleUrls: ['./course-modal.component.scss'],
})
export class CourseModalComponent {
  form: UntypedFormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public course: Course,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<CourseModalComponent>
  ) {
    this.form = this.formBuilder.group({
      id: this.course?.id,
      name: [this.course?.name, Validators.required],
      description: [this.course?.description, Validators.required],
    });
  }

  onSaveCourse() {
    // TODO: don't submit if error
    const course = this.form.value;
    this.dialogRef.close(course);
  }
}
