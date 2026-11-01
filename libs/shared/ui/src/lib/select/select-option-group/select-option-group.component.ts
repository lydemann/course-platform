import { Component, contentChildren, input } from '@angular/core';

import { SelectOptionComponent } from '../select-option/select-option.component';

@Component({
  selector: 'app-select-option-group',
  standalone: true,
  template: '',
})
export class SelectOptionGroupComponent {
  public selectOptions = contentChildren(SelectOptionComponent);

  public label = input.required<string>();
}
