import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  LayoutModule,
  SharedModule,
} from '@course-platform/course-client/shared/ui';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@course-platform/shared/auth/domain';
import { TrpcHeaders } from '@course-platform/shared/domain/trpc-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LayoutModule, SharedModule],
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  title = 'course-client';
  languages = ['en'];
  navigation = [
    { link: 'about', label: 'anms.menu.about' },
    { link: 'feature-list', label: 'anms.menu.features' },
    { link: 'examples', label: 'anms.menu.examples' },
  ];

  constructor(translateService: TranslateService) {
    translateService.use('en');
    this.authService.handleClientAuthStateChanges((_event, session) => {
      TrpcHeaders.set({ Authorization: `Bearer ${session.access_token}` });
    });
  }
}
