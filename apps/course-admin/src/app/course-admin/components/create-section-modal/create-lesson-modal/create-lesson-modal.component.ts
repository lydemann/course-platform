import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-lesson-modal',
  templateUrl: './create-lesson-modal.component.html',
  styleUrls: ['./create-lesson-modal.component.scss']
})
export class CreateLessonModalComponent {
  sectionName: string;

  constructor(public dialogRef: MatDialogRef<CreateLessonModalComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
