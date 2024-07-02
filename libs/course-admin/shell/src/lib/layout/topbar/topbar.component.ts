import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@course-platform/shared/auth/domain';
import { Observable, from } from 'rxjs';

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
})
export class TopbarComponent {
  languages = ['en'];
  homeUrl: string;
  navigationItems: NavigationItem[];
  loggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.loggedIn$ = this.authService.isLoggedIn();
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
