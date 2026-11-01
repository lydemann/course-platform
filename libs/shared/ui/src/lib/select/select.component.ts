/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  Component,
  contentChildren,
  computed,
  EventEmitter,
  forwardRef,
  input,
  Input,
  Output,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { SelectOptionGroupComponent } from './select-option-group/select-option-group.component';
import { SelectOptionGroup } from './select-option-group/select-option-group.interface';
import { SelectOptionComponent } from './select-option/select-option.component';
import { SelectOption } from './select-option/select-option.interface';

@Component({
  selector: 'app-select',
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    SelectOptionComponent,
    SelectOptionGroupComponent,
  ],
  template: `
    <mat-form-field class="form">
      <mat-select
        [disabled]="disabled()"
        [placeholder]="placeholder()"
        (selectionChange)="onSelected($event)"
        [ngModel]="selected()"
      >
        @for (option of options(); track option) {
          <mat-option [value]="option.value">
            <ng-template
              [ngTemplateOutlet]="
                $safeNavigationMigration(option?.templateRef)!
              "
            ></ng-template>
          </mat-option>
        }
        @for (group of optionsGroups(); track group) {
          <mat-optgroup [label]="group.label">
            @for (option of group.options; track option) {
              <mat-option [value]="option.value">
                <ng-template
                  [ngTemplateOutlet]="
                    $safeNavigationMigration(option?.templateRef)!
                  "
                ></ng-template>
              </mat-option>
            }
          </mat-optgroup>
        }
      </mat-select>
    </mat-form-field>
  `,
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line: no-forward-ref
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() public set value(value: string) {
    this.selected.set(value);
  }
  public placeholder = input('');
  public selectOptions = contentChildren(SelectOptionComponent);
  public selectOptionGroups = contentChildren(SelectOptionGroupComponent);
  @Output() public valueChange = new EventEmitter();
  public readonly options = computed(() =>
    this.getOptions(this.selectOptions()),
  );
  public readonly optionsGroups = computed(() =>
    this.getOptionGroups(this.selectOptionGroups()),
  );
  public selected = signal<string | null>(null);
  public disabled = signal(false);
  public touched = false;
  private internalValue!: SelectOption;
  optionsLala = [
    {
      id: 'some',
    } as MatOption,
  ];

  public onChange: any = (_: SelectOption | null) => {
    /*Empty*/
  };

  // tslint:disable-next-line: no-empty
  public onTouched: any = (_: any) => {};

  public onSelected($event: { value: any }) {
    this.selected.set($event.value);
    this.onChange($event.value);
    this.valueChange.emit($event.value);
  }

  // CONTROL VALUE ACCESSOR

  public writeValue(value: any): void {
    this.internalValue = value;
    this.onChange(this.internalValue);
    this.valueChange.emit(value);
    this.selected.set(value);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
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

  private getOptionGroups(list: readonly SelectOptionGroupComponent[]) {
    return list.length
      ? list.map((group) => ({
          label: group.label(),
          options: this.getOptions(group.selectOptions()),
        }))
      : [];
  }

  private getOptions(list: readonly SelectOptionComponent[]): SelectOption[] {
    return list.length
      ? list.map((item: SelectOptionComponent) => ({
          value: item.value(),
          templateRef: item.templateRef,
        }))
      : [];
  }
}
