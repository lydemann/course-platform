/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
  UntypedFormControl,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

class DateErrorStateMatcher implements ErrorStateMatcher {
  private hasError = false;

  constructor(hasError$: Observable<boolean>, destroy$: Observable<void>) {
    hasError$.pipe(takeUntil(destroy$)).subscribe((hasError) => {
      this.hasError = hasError;
    });
  }

  public isErrorState(
    control: UntypedFormControl,
    form: NgForm | FormGroupDirective,
  ): boolean {
    const isSubmitted = form && form.submitted;
    const isInvalidAndTouched = !!(
      control &&
      control.invalid &&
      (!form || isSubmitted || control.touched)
    );

    return this.hasError !== undefined ? this.hasError : isInvalidAndTouched;
  }
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  standalone: false,
})
export class DatePickerComponent
  implements ControlValueAccessor, OnDestroy, AfterViewInit
{
  public readonly selectedDate = signal<Date | null>(null);
  @Input()
  public set date(value: Date | null) {
    this.selectedDate.set(value);
  }

  public minDate = input<Date>();
  public maxDate = input<Date>();

  public errorMessage = input('Invalid input');
  public placeholder = input('Choose a date');
  public dateChange: EventEmitter<Date> = new EventEmitter();
  public isDisabled = signal(false);
  // used to display mat error
  public formControl = signal(new UntypedFormControl(''));
  private destroy$ = new Subject<void>();
  private _showErrorSubject = new BehaviorSubject<boolean>(false);
  private _showError$: Observable<boolean> =
    this._showErrorSubject.asObservable();
  // tslint:disable-next-line: member-ordering
  public dateErrorStateMatcher = new DateErrorStateMatcher(
    this._showError$,
    this.destroy$.asObservable(),
  );

  private onTouched = Function;

  constructor(public ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }
  @Input()
  public set showError(v: boolean) {
    this._showErrorSubject.next(v);
  }
  public ngAfterViewInit(): void {
    // syncing with validators on host element
    this.formControl.set(this.ngControl.control as UntypedFormControl);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  public onDateChange(dateInput: MatDatepickerInputEvent<Date>) {
    const date = dateInput.value;
    this.selectedDate.set(date);
    this.onChange(date!);
    this.onTouched();
    this.dateChange.next(date!);
  }

  public writeValue(obj: Date): void {
    this.selectedDate.set(obj);
  }
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  public setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // tslint:disable-next-line: no-empty
  private onChange = (date: Date) => {};
}
