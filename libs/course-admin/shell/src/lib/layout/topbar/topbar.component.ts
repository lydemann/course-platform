import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@course-platform/shared/auth/domain';
import { toSignal } from '@angular/core/rxjs-interop';

interface NavigationItem {
  link: string;
  label: string;
  icon?: string;
  externalLink?: boolean;
}

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TopbarComponent {
  languages = ['en'];
  homeUrl: string;
  navigationItems: NavigationItem[];
  loggedIn;

  constructor(private authService: AuthService) {
    this.loggedIn = toSignal(this.authService.isLoggedIn(), {
      initialValue: false,
    });
    this.homeUrl = '/courses';
    this.navigationItems = [
      {
        link: `/create-user`,
        label: 'Create user',
        icon: 'person',
      },
      {
        link: `/settings`,
        label: 'Settings',
        icon: 'settings',
      },
    ];
  }
}
