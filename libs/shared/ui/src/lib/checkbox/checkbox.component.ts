import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  standalone: false,
})
export class CheckboxComponent {
  public label = input('');
  public disabled = input(false);
  public checked = input(false);
  public labelPosition = input<'before' | 'after'>('after'); // Supports 'before' and 'after'
  public indeterminate = input(false); // True renders indeterminate state regardless of checked value. Interactions (e.g. clicking) sets this to false.
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() public change = new EventEmitter<boolean>();

  public onChanged($event: { checked: boolean }) {
    this.change.emit($event.checked);
  }
}
