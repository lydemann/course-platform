import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-lesson-modal',
  templateUrl: './create-lesson-modal.component.html',
  styleUrls: ['./create-lesson-modal.component.scss'],
  standalone: false,
})
export class CreateLessonModalComponent {
  lessonName = '';

  constructor(public dialogRef: MatDialogRef<CreateLessonModalComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close(this.lessonName);
  }
}
