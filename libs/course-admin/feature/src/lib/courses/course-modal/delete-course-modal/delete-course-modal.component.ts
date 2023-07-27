import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Course } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-delete-course-modal',
  templateUrl: './delete-course-modal.component.html',
})
export class DeleteCourseModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public course: Course,
    private dialogRef: MatDialogRef<DeleteCourseModalComponent>
  ) {}

  onDeleteCourse() {
    this.dialogRef.close(this.course);
  }
}
