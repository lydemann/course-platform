import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CourseAdminFacadeService } from '@course-platform/course-admin-lib';
import { UserService } from '@course-platform/shared/feat-auth';

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
export class TopbarComponent implements OnInit {
  languages = ['en'];
  homeUrl: string;
  navigationItems: NavigationItem[];
  loggedIn$: Observable<boolean>;

  constructor(
    private userService: UserService,
    private courseAdminFacade: CourseAdminFacadeService
  ) {}

  ngOnInit() {
    this.loggedIn$ = this.userService.isLoggedIn$;
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
