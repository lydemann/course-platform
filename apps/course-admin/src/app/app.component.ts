import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { RemoteEntryModule } from '@course-platform/course-admin/shell';
import { AuthService } from '@course-platform/shared/auth/domain';
import { TrpcHeaders } from '@course-platform/shared/domain/trpc-client';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],
  imports: [RemoteEntryModule],
})
export class AppComponent {
  private readonly authService = inject(AuthService);

  constructor() {
    this.authService.handleClientAuthStateChanges((_event, session) => {
      TrpcHeaders.set({ Authorization: `Bearer ${session.access_token}` });
    });
  }
}
