import { ChangeDetectionStrategy } from '@angular/core';
import { Component, ContentChildren, Input, QueryList } from '@angular/core';

import { SelectOptionComponent } from '../select-option/select-option.component';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-select-option-group',
  standalone: true,
  template: '',
})
export class SelectOptionGroupComponent {
  @ContentChildren(SelectOptionComponent)
  public selectOptions!: QueryList<SelectOptionComponent>;

  @Input() public label!: string;
}
