import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SharedModule } from '@course-platform/course-client/shared/ui';

import { ActionItem } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-action-item',
  templateUrl: './action-item.component.html',
  styleUrls: ['./action-item.component.scss'],
  standalone: true,
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionItemComponent {
  @Input() answerItem?: ActionItem;
  @Output() completeChanged = new EventEmitter<boolean>();

  onActionItemCompleteChange() {
    this.completeChanged.next(!this.answerItem?.isCompleted);
  }
}
