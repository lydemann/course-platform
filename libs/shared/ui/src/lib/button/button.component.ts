import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() color: 'primary' | 'accent' | 'warn' | 'success' = 'primary';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() buttonVariant: 'raised' | 'button' | 'fab' | 'mini-fab' | 'icon' =
    'raised';
  @Input() size: 'm' | 'l' = 'm';

  @Output() clicked = new EventEmitter<Event>();

  constructor() {}
}
