import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { ExecFileOptionsWithStringEncoding } from 'child_process';

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
    { link: 'community', label: 'Community' },
    { link: 'help', label: 'Help' },
    { link: 'profile', label: 'Profile' }
  ];
  logo = require('../../../../assets/logo.png').default;
  constructor() {}

  ngOnInit() {}
}
