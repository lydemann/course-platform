import { Component, Input } from '@angular/core';

import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-spinner',
  template: ''
})
// tslint:disable-next-line:component-class-suffix
export class SpinnerComponentMock implements SpinnerComponent {
  @Input() public message = '';
}
