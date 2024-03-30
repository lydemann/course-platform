import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';

import { SharedModule } from '@course-platform/course-admin/shared/ui';
import { LessonResourceType } from '@course-platform/shared/interfaces';
import { LessonAdminForm } from '../lesson-admin.component';

@Component({
  selector: 'app-lesson-admin-form',
  templateUrl: './lesson-admin-form.component.html',
  styleUrls: ['./lesson-admin-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SharedModule],
})
export class LessonAdminFormComponent {
  private _formGroup!: LessonAdminForm;
  public get formGroup(): LessonAdminForm {
    return this._formGroup;
  }
  @Input()
  public set formGroup(formGroup: LessonAdminForm) {
    this._formGroup = formGroup;
  }

  @Output() save = new EventEmitter<UntypedFormGroup>();
  @Output() deleteClicked = new EventEmitter<UntypedFormGroup>();
  @Output() addResourceClicked = new EventEmitter();
  @Output() deleteResourceClicked = new EventEmitter<string>();
  private formBuilder = inject(FormBuilder);

  addResource() {
    const newResource = this.formBuilder.group({
      id: [Guid.create().toString()],
      name: ['', Validators.required],
      url: ['', Validators.required],
      type: [LessonResourceType.WorkSheet, Validators.required],
    });

    this.formGroup.controls.resources.push(newResource);
  }

  onSave() {
    this.save.emit(this.formGroup);
  }

  get resourceTypes() {
    return [
      LessonResourceType.WorkSheet,
      LessonResourceType.CheatSheet,
      LessonResourceType.Other,
    ];
  }
}
