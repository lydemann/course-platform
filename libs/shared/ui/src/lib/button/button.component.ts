import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: false,
})
export class ButtonComponent {
  color = input<'primary' | 'accent' | 'warn' | 'success'>('primary');
  disabled = input(false);
  type = input<'button' | 'submit'>('button');
  buttonVariant = input<'raised' | 'button' | 'fab' | 'mini-fab' | 'icon'>(
    'raised',
  );
  size = input<'m' | 'l'>('m');

  @Output() clicked = new EventEmitter<Event>();

  constructor() {}
}
