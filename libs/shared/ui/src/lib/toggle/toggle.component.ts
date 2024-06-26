import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
})
export class ToggleComponent {
  @Input()
  public set isIcon(isIcon: boolean) {
    this.disabled = true;
    this._isIcon = isIcon;
  }
  public get isIcon(): boolean {
    return this._isIcon;
  }
  @Input() public labelPosition: 'before' | 'after' = 'after';
  @Input() public labelTextOn!: string;
  @Input() public labelTextOff!: string;
  @Input() public disabled = false;
  @Input() public checked = false;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() public change = new EventEmitter<boolean>();
  private _isIcon = false; // Disable interaction but keep style

  public toggleChange(event: MatSlideToggleChange) {
    this.checked = event.checked;
    this.change.emit(event.checked);
  }
}
