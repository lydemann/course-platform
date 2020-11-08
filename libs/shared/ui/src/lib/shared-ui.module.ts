import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionModule } from './accordion/accordion.module';
import { ButtonModule } from './button/button.module';
import { CheckboxModule } from './checkbox/checkbox.module';
import { DatePickerModule } from './date-picker/date-picker.module';
import { IconModule } from './icon/icon.module';
import { InputModule } from './input/input.module';
import { SelectModule } from './select/select.module';
import { SpinnerOverlayWrapperModule } from './spinner-overlay-wrapper/spinner-overlay-wrapper.module';
import { SpinnerModule } from './spinner/spinner.module';
import { TextareaModule } from './textarea/textarea.module';
import { ToggleModule } from './toggle/toggle.module';

const IMPORTS = [
  SpinnerModule,
  SpinnerOverlayWrapperModule,
  CheckboxModule,
  IconModule,
  AccordionModule,
  TextareaModule,
  ToggleModule,
  DatePickerModule,
  InputModule,
  SelectModule,
  ButtonModule
];

@NgModule({
  imports: [CommonModule, ...IMPORTS],
  exports: [...IMPORTS]
})
export class SharedUiModule {}
