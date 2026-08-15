import { Component, Input } from '@angular/core';

import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-spinner',
  template: '',
})
export class SpinnerComponentMock implements SpinnerComponent {
  @Input() public message = '';
}
