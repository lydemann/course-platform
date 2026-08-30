import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  templateUrl: 'layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LayoutComponent {
  constructor() {}
}
