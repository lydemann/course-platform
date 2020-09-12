import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('sections')
  getCourseSections() {
    return [
      {
        id: '1',
        name: 'Week 1',
        lessons: [
          {
            id: '1',
            title: '1. First lesson',
            description: 'This is the first lesson'
          },
          {
            id: '2',
            title: '2. Second lesson',
            description: 'This is the second lesson'
          },
          {
            id: '3',
            title: '3. Third lesson',
            description: 'This is the first lesson'
          },
          {
            id: '4',
            title: '4. Forth lesson',
            description: 'This is the second lesson'
          },
          {
            id: '5',
            title: '5. Fifth lesson',
            description: 'This is the first lesson'
          }
        ]
      }
    ];
  }
}
