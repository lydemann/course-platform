import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-select-option',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './select-option.component.html',
})
export class SelectOptionComponent {
  @ViewChild('label') public templateRef!: TemplateRef<unknown>;
  @Input() public value!: unknown;
}
