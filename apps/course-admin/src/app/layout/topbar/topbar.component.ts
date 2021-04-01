import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { auth } from 'firebase';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  logo = require('../../../assets/logo.png').default;
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
