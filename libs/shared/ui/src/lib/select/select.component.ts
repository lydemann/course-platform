/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnChanges,
  Output,
  QueryList,
  signal,
  SimpleChanges,
  ChangeDetectionStrategy,
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
        [disabled]="disabled"
        [placeholder]="placeholder"
        (selectionChange)="onSelected($event)"
        [(ngModel)]="selected"
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
export class SelectComponent
  implements OnChanges, AfterContentInit, ControlValueAccessor
{
  @Input() public set value(value: string) {
    this.selected = value;
  }
  @Input()
  public placeholder!: string;
  @ContentChildren(SelectOptionComponent)
  public selectOptions!: QueryList<SelectOptionComponent>;
  @ContentChildren(SelectOptionGroupComponent)
  public selectOptionGroups!: QueryList<SelectOptionGroupComponent>;
  @Output() public valueChange = new EventEmitter();
  // Signals rather than plain fields: these are populated from @ContentChildren
  // subscriptions, and under OnPush — the default in Angular 22 — assigning a
  // plain field does not mark the view dirty, so the dropdown rendered stale
  // options. A signal notifies the template itself, so it cannot be forgotten.
  public readonly options = signal<SelectOption[]>([]);
  public readonly optionsGroups = signal<SelectOptionGroup[]>([]);
  public selected!: string | null;
  public disabled = false;
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
    this.selected = $event.value;
    this.onChange($event.value);
    this.valueChange.emit($event.value);
  }

  public ngOnChanges(change: SimpleChanges) {
    if (change['options']) {
      if (change['options'].isFirstChange()) {
        return;
      }
      if (change['options'].currentValue !== change['options'].previousValue) {
        this.selected = null; // Resetting the model to show placeholder
        this.onChange(null);
      }
    }
  }

  private readonly cdr = inject(ChangeDetectorRef);

  public ngAfterContentInit() {
    this.options.set(this.getOptions(this.selectOptions));
    this.optionsGroups.set(this.getOptionGroups(this.selectOptionGroups));

    this.selectOptionGroups.changes.subscribe(
      (optionGroups: QueryList<SelectOptionGroupComponent>) =>
        this.optionsGroups.set(this.getOptionGroups(optionGroups)),
    );

    this.selectOptions.changes.subscribe((options: QueryList<SelectOption>) =>
      this.options.set(options.length ? this.getOptions(options) : []),
    );
  }

  // CONTROL VALUE ACCESSOR

  public writeValue(value: any): void {
    this.internalValue = value;
    this.onChange(this.internalValue);
    this.valueChange.emit(value);
    this.selected = value;
    // Called by Angular forms, outside any template binding.
    this.cdr.markForCheck();
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
    this.disabled = isDisabled;
  }

  private getOptionGroups(list: QueryList<SelectOptionGroupComponent>) {
    return list.length
      ? list.map((group) => ({
          label: group.label,
          options: this.getOptions(group.selectOptions),
        }))
      : [];
  }

  private getOptions(list: QueryList<SelectOptionComponent>): SelectOption[] {
    return list.length
      ? list.map((item: SelectOptionComponent) => ({
          value: item.value,
          templateRef: item.templateRef,
        }))
      : [];
  }
}
