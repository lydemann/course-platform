import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@course-platform/shared/auth/domain';

@Component({
  selector: 'lib-logout',
  template: `<p>Logging out...</p>`,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent {
  constructor(private authService: AuthService) {
    this.authService.signOut();
  }
}
