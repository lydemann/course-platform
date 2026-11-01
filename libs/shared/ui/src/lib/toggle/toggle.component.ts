import { Component, EventEmitter, input, model, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  standalone: false,
})
export class ToggleComponent {
  public isIcon = input(false);
  public labelPosition = input<'before' | 'after'>('after');
  public labelTextOn = input('');
  public labelTextOff = input('');
  public disabled = input(false);
  public checked = model(false);
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() public change = new EventEmitter<boolean>();

  public toggleChange(event: MatSlideToggleChange) {
    this.checked.set(event.checked);
    this.change.emit(event.checked);
  }
}
