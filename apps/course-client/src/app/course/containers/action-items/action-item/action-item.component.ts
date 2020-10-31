import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { ActionItem } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-action-item',
  templateUrl: './action-item.component.html',
  styleUrls: ['./action-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionItemComponent {
  @Input() answerItem: ActionItem;
  @Output() completeChanged = new EventEmitter<boolean>();
}
