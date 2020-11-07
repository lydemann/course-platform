import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-section-admin-form',
  templateUrl: './section-admin-form.component.html',
  styleUrls: ['./section-admin-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionAdminFormComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Output() saveClicked = new EventEmitter<FormGroup>();
  @Output() deleteClicked = new EventEmitter<FormGroup>();

  constructor() {}

  ngOnInit() {}
}
