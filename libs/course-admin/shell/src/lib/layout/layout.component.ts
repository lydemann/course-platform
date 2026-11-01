import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: 'layout.component.html',
  standalone: false,
})
export class LayoutComponent {
  constructor() {}
}
