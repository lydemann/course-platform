import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  template: '',
})
export class SelectComponentMock {
  @Input() public placeholder!: string;
  @Input() public disabled = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() public options!: [{ label: string; value: any }];
}
