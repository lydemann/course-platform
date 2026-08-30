import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-select-option',
  imports: [],
  templateUrl: './select-option.component.html',
})
export class SelectOptionComponent {
  @ViewChild('label') public templateRef!: TemplateRef<unknown>;
  @Input() public value!: unknown;
}
