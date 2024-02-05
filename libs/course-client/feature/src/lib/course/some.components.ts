import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-some',
  // inline template
  template: `
    <!-- Uses TailWindCSS -->
    <h3 class="text-center mt-10">This is some component</h3>
    <!-- Data binding with Signals -->
    <p>Showing some data with Signals: {{ someService.someData() }}</p>
  `,
  // standalone component
  standalone: true,
  imports: [SharedUIModule],
  // OnPush in all components for local change detection only
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SomeComponent {
  // no need to inject in constructor or life cycle hooks
  someService = inject(SomeService);
}
