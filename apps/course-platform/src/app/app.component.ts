import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutModule } from '@course-platform/course-client/shared/ui';

@Component({
  selector: 'course-platform-root',
  standalone: true,
  imports: [RouterOutlet, LayoutModule],
  template: `
    <app-topbar></app-topbar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
