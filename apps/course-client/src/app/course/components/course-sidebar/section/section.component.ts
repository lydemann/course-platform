import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

import { CourseSection } from '@course-platform/shared/interfaces';

export interface SectionDropDownValue {
  value: string;
  name: string;
}

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent implements OnInit {
  @Input() section: CourseSection;

  sections: SectionDropDownValue[] = [
    {
      name: 'Week 1',
      value: 'w-1'
    },
    {
      name: 'Week 2',
      value: 'w-2'
    },
    {
      name: 'Week 3',
      value: 'w-3'
    },
    {
      name: 'Week 4',
      value: 'w-4'
    },
    {
      name: 'Week 5',
      value: 'w-5'
    },
    {
      name: 'Week 6',
      value: 'w-6'
    },
    {
      name: 'Week 7',
      value: 'w-7'
    },
    {
      name: 'Week 8',
      value: 'w-8'
    },
    {
      name: 'Bonus week',
      value: 'w-b'
    }
  ];

  selected = 'option2';

  selectedSection = 'w-1';

  constructor() {}

  ngOnInit() {}
}
