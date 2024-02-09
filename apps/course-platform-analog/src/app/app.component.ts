import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutModule } from '@course-platform/course-client/shared/ui';
import { SchoolIdService } from '@course-platform/shared/domain';

@Component({
  selector: 'course-platform-root',
  standalone: true,
  imports: [RouterOutlet, LayoutModule],
  template: `
    <app-topbar></app-topbar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor(private schoolIdService: SchoolIdService) {
    this.schoolIdService.setSchoolIdFromCustomDomain();
  }
}
