import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-section-admin-form',
  templateUrl: './section-admin-form.component.html',
  styleUrls: ['./section-admin-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionAdminFormComponent {
  @Input() formGroup!: UntypedFormGroup;
  @Output() saveClicked = new EventEmitter<UntypedFormGroup>();
  @Output() deleteClicked = new EventEmitter<UntypedFormGroup>();
}
