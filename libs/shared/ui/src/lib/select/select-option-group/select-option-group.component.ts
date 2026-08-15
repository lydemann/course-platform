import {
  Component,
  ContentChildren,
  Input,
  QueryList,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SelectOptionComponent } from '../select-option/select-option.component';

@Component({
  selector: 'app-select-option-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
export class SelectOptionGroupComponent {
  @ContentChildren(SelectOptionComponent)
  public selectOptions!: QueryList<SelectOptionComponent>;

  @Input() public label!: string;
}
