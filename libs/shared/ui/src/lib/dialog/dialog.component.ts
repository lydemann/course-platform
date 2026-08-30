import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogComponent {
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  title = 'Are you sure?';
  message = '';
  cancelBtnText = 'No';
  okBtnText = 'Yes';

  constructor() {
    if (this.data.title) {
      this.title = this.data.title;
    }
    if (this.data.message) {
      this.message = this.data.message;
    }
    if (this.data.cancelBtnText) {
      this.cancelBtnText = this.data.cancelBtnText;
    }
    if (this.data.okBtnText) {
      this.okBtnText = this.data.okBtnText;
    }
  }
}
