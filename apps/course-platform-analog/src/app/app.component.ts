import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { LayoutModule } from '@course-platform/course-client/shared/ui';
import { AuthSBService } from '@course-platform/shared/auth/domain';
import { SchoolIdService, TrpcHeaders } from '@course-platform/shared/domain';
import { Session } from '@supabase/auth-js';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

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
  authSBService = inject(AuthSBService);
  protected readonly session = signal<Session | null>(null);
  router = inject(Router);
  constructor(private schoolIdService: SchoolIdService) {
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
