/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line: no-forward-ref
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class TextareaComponent implements ControlValueAccessor {
  public placeholder = input('');
  public touched = false;
  public disabled = signal(false);
  public value = signal('');

  // tslint:disable-next-line: no-empty
  public propagateChange: any = (_: any) => {};

  // tslint:disable-next-line: no-empty
  public onTouched: any = (_: any) => {};

  public onChange(event: any) {
    this.value.set(event);
    this.propagateChange(event);
  }

  public writeValue(obj: any): void {
    this.value.set(obj ?? '');
  }
  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  public registerOnTouched(fn: any): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.onTouched = (arg: any) => {
      self.touched = true;
      fn(arg);
    };
  }
  public setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
