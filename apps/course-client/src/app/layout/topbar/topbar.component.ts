import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from '@course-platform/shared/feat-auth';

interface NavigationItem {
  link: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent implements OnInit {
  languages = ['en'];
  navigation: NavigationItem[] = [
    // TODO: add dropdowns here
    // TODO: add icons here
    {
      link: 'https://theangulararc-zix2820.slack.com',
      label: 'Community',
      icon: 'groups'
    },
    {
      link: '/help',
      label: 'Help',
      icon: 'help'
    },
    // { link: 'help', label: 'Help', icon: 'info' },
    { link: 'profile', label: 'Profile', icon: 'person' }
  ];
  logo = require('../../../assets/logo.png').default;
  loggedIn$: Observable<boolean>;
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loggedIn$ = this.userService.isLoggedIn$;
  }
}
