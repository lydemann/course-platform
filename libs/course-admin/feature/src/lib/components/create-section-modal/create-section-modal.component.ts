import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-create-section-modal',
  templateUrl: './create-section-modal.component.html',
  styleUrls: ['./create-section-modal.component.scss'],
  standalone: false,
})
export class CreateSectionModalComponent {
  sectionName = '';

  constructor(public dialogRef: MatDialogRef<CreateSectionModalComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close(this.sectionName);
  }
}
