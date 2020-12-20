import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-section-modal',
  templateUrl: './create-section-modal.component.html',
  styleUrls: ['./create-section-modal.component.scss']
})
export class CreateSectionModalComponent {
  sectionName: string;

  constructor(public dialogRef: MatDialogRef<CreateSectionModalComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close(this.sectionName);
  }
}
