import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CourseClientFacade } from '@course-platform/course-client/shared/domain';
import { AuthService } from '@course-platform/shared/auth/domain';

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
  standalone: false,
})
export class TopbarComponent {
  languages = ['en'];
  homeUrl$!: Observable<string>;
  navigationItems!: NavigationItem[];
  loggedIn$!: Observable<boolean>;
  loggedIn!: Signal<boolean>;
  homeUrl!: Signal<string | undefined>;

  constructor(
    private authService: AuthService,
    private courseClientFacade: CourseClientFacade,
  ) {
    this.loggedIn$ = this.authService.isLoggedIn();
    this.homeUrl$ = this.courseClientFacade.courseId$.pipe(
      map((courseId) => `courses/${courseId ? courseId : ''}`),
    );
    this.loggedIn = toSignal(this.loggedIn$, { initialValue: false });
    this.homeUrl = toSignal(this.homeUrl$);
    this.navigationItems = [
      {
        link: 'https://discord.gg/c8NxzFcwDP',
        label: 'Community',
        icon: 'groups',
        externalLink: true,
      },
      {
        link: `help`,
        label: 'Help',
        icon: 'help',
      },
      {
        link: `profile`,
        label: 'Profile',
        icon: 'person',
      },
    ];
  }
}
