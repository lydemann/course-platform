import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Lesson } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.scss']
})
export class CourseContentComponent {
  private _lesson: Lesson;
  public get lesson(): Lesson {
    return this._lesson;
  }
  @Input()
  public set lesson(lesson: Lesson) {
    this._lesson = lesson;
    if (lesson) {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        lesson.videoUrl
      );
    }
  }

  videoUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}
}
