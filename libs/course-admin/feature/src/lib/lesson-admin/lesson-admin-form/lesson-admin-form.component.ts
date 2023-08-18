import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { LessonResourceType } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-lesson-admin-form',
  templateUrl: './lesson-admin-form.component.html',
  styleUrls: ['./lesson-admin-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonAdminFormComponent {
  private _formGroup: UntypedFormGroup;
  public get formGroup(): UntypedFormGroup {
    return this._formGroup;
  }
  @Input()
  public set formGroup(formGroup: UntypedFormGroup) {
    this._formGroup = formGroup;
    this.hasTempResource =
      formGroup.controls.resources['controls'][
        formGroup.controls.resources['controls'].length - 1
      ]?.controls.id.value === '';
  }

  @Output() saveClicked = new EventEmitter<UntypedFormGroup>();
  @Output() deleteClicked = new EventEmitter<UntypedFormGroup>();
  @Output() addResourceClicked = new EventEmitter();
  @Output() deleteResourceClicked = new EventEmitter<string>();
  hasTempResource: boolean;

  get resourceTypes() {
    return [
      LessonResourceType.WorkSheet,
      LessonResourceType.CheatSheet,
      LessonResourceType.Other,
    ];
  }
}
