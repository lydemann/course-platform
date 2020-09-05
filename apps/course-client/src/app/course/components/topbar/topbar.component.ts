import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent implements OnInit {
  languages = ['en'];
  navigation = [
    // TODO: add dropdowns here
    { link: 'about', label: 'Community' },
    { link: 'feature-list', label: 'Help' },
    { link: 'examples', label: 'Hi!' }
  ];
  logo = require('../../../../assets/logo.png').default;
  constructor() {}

  ngOnInit() {}
}