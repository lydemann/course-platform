import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Course } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-delete-course-modal',
  templateUrl: './delete-course-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DeleteCourseModalComponent {
  readonly course = inject<Course>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DeleteCourseModalComponent>);

  onDeleteCourse() {
    this.dialogRef.close(this.course);
  }
}
