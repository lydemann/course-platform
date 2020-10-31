import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-action-item',
  templateUrl: './action-item.component.html',
  styleUrls: ['./action-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionItemComponent {
  @Input() title: string;
  @Input() answerDescription = 'Simple yes/no question.';
  @Input() isCompleted: boolean;
  @Output() completeChanged = new EventEmitter<boolean>();
}
