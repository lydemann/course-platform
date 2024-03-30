import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
  cancelBtnText: string;
  okBtnText: string;
}

@Component({
  template: ` <h2 mat-dialog-title>{{ title }}</h2>
    <mat-dialog-content> {{ message }}] </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>{{ cancelBtnText }}</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>
        {{ okBtnText }}
      </button>
    </mat-dialog-actions>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class DialogComponent {
  title = 'Are you sure?';
  message = '';
  cancelBtnText = 'No';
  okBtnText = 'Yes';

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    if (data.title) {
      this.title = data.title;
    }
    if (data.message) {
      this.message = data.message;
    }
    if (data.cancelBtnText) {
      this.cancelBtnText = data.cancelBtnText;
    }
    if (data.okBtnText) {
      this.okBtnText = data.okBtnText;
    }
  }
}
