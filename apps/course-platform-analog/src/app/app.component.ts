import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { LayoutModule } from '@course-platform/course-client/shared/ui';
import { AuthService } from '@course-platform/shared/auth/domain';
import { TrpcHeaders } from '@course-platform/shared/domain/trpc-client';
import { CopilotKit } from '@copilotkit/angular';
import { Session } from '@supabase/auth-js';

@Component({
  selector: 'course-platform-root',
  imports: [RouterOutlet, LayoutModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-topbar></app-topbar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  authSBService = inject(AuthService);
  protected readonly session = signal<Session | null>(null);
  router = inject(Router);
  private readonly copilotKit = inject(CopilotKit);
  constructor() {
    this.authSBService.handleClientAuthStateChanges((event, session) => {
      console.log('Auth state change:', event);
      if (session) {
        const headers = { Authorization: `Bearer ${session.access_token}` };
        TrpcHeaders.set(headers);
        // The copilot runtime authenticates with the same Supabase JWT and
        // returns 401 without it.
        this.copilotKit.updateRuntime({ headers });
      } else {
        TrpcHeaders.set({});
        this.copilotKit.updateRuntime({ headers: {} });
      }
    });
  }
}
