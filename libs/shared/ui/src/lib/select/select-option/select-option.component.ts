import { Component, input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-select-option',
  imports: [],
  templateUrl: './select-option.component.html',
})
export class SelectOptionComponent {
  @ViewChild('label') public templateRef!: TemplateRef<unknown>;
  public value = input<unknown>();
}
