import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { CourseAdminFacadeService } from '@course-platform/course-admin-lib';
import {
  Lesson,
  LessonResource,
  LessonResourceType
} from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-lesson-admin',
  templateUrl: './lesson-admin.component.html',
  styleUrls: ['./lesson-admin.component.scss']
})
export class LessonAdminComponent implements OnInit {
  lesson$: Observable<Lesson>;
  formGroup$: Observable<FormGroup> = of(null);
  isAddingResource$ = new BehaviorSubject(false);
  constructor(
    private courseAdminFacade: CourseAdminFacadeService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.lesson$ = combineLatest([
      this.courseAdminFacade.currentLesson$,
      this.formGroup$
    ]).pipe(
      map(([lesson, form]) => {
        return {
          ...lesson,
          ...form?.value
        };
      })
    );
    this.formGroup$ = combineLatest([
      this.lesson$,
      this.isAddingResource$
    ]).pipe(
      filter(([lesson]) => !!lesson),
      map(([lesson, isAddingresource]) => {
        const form = this.formBuilder.group({
          name: [lesson.name, Validators.required],
          description: [lesson.description, Validators.required],
          videoUrl: [lesson.videoUrl, Validators.required],
          resources: this.formBuilder.array([
            ...lesson.resources.map(resource => {
              return this.formBuilder.group({
                name: [resource.name],
                url: [resource.url],
                type: [resource.type]
              } as { [key in keyof LessonResource]: any });
            })
          ])
        });

        if (isAddingresource) {
          const newResource = this.formBuilder.group({
            name: [''],
            url: [''],
            type: [LessonResourceType.WorkSheet]
          } as { [key in keyof LessonResource]: any });
          (form.get('resources') as FormArray).push(newResource);
        }

        return form;
      })
    );
  }

  submit(formGroup: FormGroup, lesson: Lesson) {
    this.courseAdminFacade.saveLessonClicked({
      id: lesson.id,
      ...formGroup.value
    } as Lesson);
    this.isAddingResource$.next(false);
  }

  onAddResourceClicked() {
    this.isAddingResource$.next(true);
  }

  onDelete(lesson: Lesson) {
    const sectionId = this.route.snapshot.params.sectionId;
    this.courseAdminFacade.deleteLessonClicked(sectionId, lesson.id);
  }
}
