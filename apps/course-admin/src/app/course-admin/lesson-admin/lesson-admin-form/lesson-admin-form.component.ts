import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { LessonResourceType } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-lesson-admin-form',
  templateUrl: './lesson-admin-form.component.html',
  styleUrls: ['./lesson-admin-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonAdminFormComponent {
  @Input() formGroup: FormGroup;
  @Output() saveClicked = new EventEmitter<FormGroup>();
  @Output() deleteClicked = new EventEmitter<FormGroup>();
  @Output() addResourceClicked = new EventEmitter();
  @Output() deleteResourceClicked = new EventEmitter<string>();

  get resourceTypes() {
    return [
      LessonResourceType.WorkSheet,
      LessonResourceType.CheatSheet,
      LessonResourceType.Other
    ];
  }
}
