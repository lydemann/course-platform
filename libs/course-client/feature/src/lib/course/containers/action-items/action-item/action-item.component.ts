import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  input,
} from '@angular/core';
import { SharedModule } from '@course-platform/course-client/shared/ui';
import { ActionItem } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-action-item',
  template: `<div (click)="onActionItemCompleteChange()" class="p-2">
    <div class="mb-2">
      <h5>
        {{ actionItem().question }}
      </h5>
      <p>{{ actionItem().answerDescription }}</p>
    </div>
    <div>
      <mat-icon class="icon" [class.text-success]="actionItem().isCompleted"
        >check_circle</mat-icon
      >
    </div>
  </div> `,
  styleUrls: ['./action-item.component.scss'],
  standalone: true,
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionItemComponent {
  actionItem = input.required<ActionItem>();
  @Output() completeChanged = new EventEmitter<boolean>();

  onActionItemCompleteChange() {
    this.completeChanged.next(!this.actionItem().isCompleted);
  }
}
