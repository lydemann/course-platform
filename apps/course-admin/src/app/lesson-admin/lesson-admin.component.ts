import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { CourseAdminFacadeService } from '@course-platform/course-admin-lib';
import { Lesson } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-lesson-admin',
  templateUrl: './lesson-admin.component.html',
  styleUrls: ['./lesson-admin.component.scss']
})
export class LessonAdminComponent implements OnInit {
  lesson$: Observable<Lesson>;
  lesson: Lesson;
  formGroup: FormGroup;
  constructor(
    private courseAdminFacade: CourseAdminFacadeService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.lesson$ = this.courseAdminFacade.currentLesson$;
    this.lesson$
      .pipe(
        filter(lesson => !!lesson),
        first()
      )
      .subscribe(lesson => {
        this.lesson = lesson;
        this.formGroup = this.formBuilder.group({
          name: [lesson.name, Validators.required],
          description: [lesson.description, Validators.required],
          videoUrl: [lesson.videoUrl, Validators.required]
        });
      });
  }

  submit() {
    this.courseAdminFacade.saveLessonClicked({
      id: this.lesson.id,
      ...this.formGroup.value
    } as Lesson);
  }

  onDelete() {
    const sectionId = this.route.snapshot.params.sectionId;
    this.courseAdminFacade.deleteLessonClicked(sectionId, this.lesson.id);
  }
}
