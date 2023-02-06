import {
  Component,
  ContentChildren,
  Directive,
  Input,
  QueryList,
} from '@angular/core';

import { SelectOptionComponent } from '../select-option/select-option.component';

@Component({
  selector: 'app-select-option-group',
  standalone: true,
  template: '',
})
export class SelectOptionGroupComponent {
  @ContentChildren(SelectOptionComponent)
  public selectOptions: QueryList<SelectOptionComponent>;

  @Input() public label: string;
}
