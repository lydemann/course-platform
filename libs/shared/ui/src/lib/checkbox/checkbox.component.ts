import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  @Input() public label = '';
  @Input() public disabled = false;
  @Input() public checked = false;
  @Input() public labelPosition = 'after'; // Supports 'before' and 'after'
  @Input() public indeterminate = false; // True renders indeterminate state regardless of checked value. Interactions (e.g. clicking) sets this to false.
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() public change = new EventEmitter<boolean>();

  public onChanged($event: { checked: boolean }) {
    this.change.emit($event.checked);
  }
}
