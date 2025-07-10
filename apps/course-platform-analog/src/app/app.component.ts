import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { LayoutModule } from '@course-platform/course-client/shared/ui';
import { AuthService } from '@course-platform/shared/auth/domain';
import { TrpcHeaders } from '@course-platform/shared/domain/trpc-client';
import { Session } from '@supabase/auth-js';

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
  authSBService = inject(AuthService);
  protected readonly session = signal<Session | null>(null);
  router = inject(Router);
  constructor() {
    this.authSBService.handleClientAuthStateChanges((event, session) => {
      console.log('Auth state change:', event);
      if (session) {
        TrpcHeaders.set({ Authorization: `Bearer ${session.access_token}` });
      } else {
        TrpcHeaders.set({});
      }
    });
  }
}
