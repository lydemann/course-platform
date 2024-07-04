import { Component, Input } from '@angular/core';

import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-spinner',
  template: '',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class SpinnerComponentMock implements SpinnerComponent {
  @Input() public message = '';
}
