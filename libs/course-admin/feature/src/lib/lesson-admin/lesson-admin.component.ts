import { Component, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { CourseAdminFacadeService } from '@course-platform/course-admin/shared/domain';
import {
  Lesson,
  LessonResource,
  LessonResourceType,
} from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-lesson-admin',
  templateUrl: './lesson-admin.component.html',
  styleUrls: ['./lesson-admin.component.scss'],
})
export class LessonAdminComponent implements OnInit {
  lesson$: Observable<Lesson>;
  formGroup$: Observable<UntypedFormGroup> = of(null);
  isAddingResource$ = new BehaviorSubject(false);
  constructor(
    private courseAdminFacade: CourseAdminFacadeService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.lesson$ = combineLatest([
      this.courseAdminFacade.currentLesson$,
      this.formGroup$,
    ]).pipe(
      map(([lesson, form]) => {
        return {
          ...lesson,
          ...form?.value,
        };
      })
    );
    this.formGroup$ = combineLatest([
      this.lesson$,
      this.isAddingResource$,
    ]).pipe(
      filter(([lesson]) => !!lesson),
      map(([lesson, isAddingresource]) => {
        const form = this.formBuilder.group({
          name: [lesson.name, Validators.required],
          description: [lesson.description, Validators.required],
          videoUrl: [lesson.videoUrl, Validators.required],
          resources: this.formBuilder.array([
            ...(lesson.resources?.map((resource) => {
              return this.formBuilder.group({
                id: [resource.id],
                name: [resource.name],
                url: [resource.url],
                type: [resource.type],
              } as { [key in keyof LessonResource]: any });
            }) || []),
          ]),
        });

        if (isAddingresource) {
          const newResource = this.formBuilder.group({
            id: [''],
            name: [''],
            url: [''],
            type: [LessonResourceType.WorkSheet],
          } as { [key in keyof LessonResource]: any });
          (form.get('resources') as UntypedFormArray).push(newResource);
        }

        return form;
      })
    );
  }

  goBack() {
    this.courseAdminFacade.goToCourseAdmin();
  }

  submit(formGroup: UntypedFormGroup, lesson: Lesson) {
    // TODO: show spinner
    this.courseAdminFacade.saveLessonClicked({
      id: lesson.id,
      ...formGroup.value,
    } as Lesson);
    this.isAddingResource$.next(false);
  }

  onAddResourceClicked() {
    this.isAddingResource$.next(true);
  }

  onDeleteResourceClicked(resourceId: string, form: UntypedFormGroup) {
    const resourcesFormGroups = (form.get('resources') as UntypedFormArray)
      .controls as UntypedFormGroup[];

    const idxToRemove = resourcesFormGroups.findIndex(
      (group) => group.get('id').value === resourceId
    );

    (form.get('resources') as UntypedFormArray).removeAt(idxToRemove);
  }

  onDelete(lesson: Lesson) {
    const sectionId = this.route.snapshot.params.sectionId;
    this.courseAdminFacade.deleteLessonClicked(sectionId, lesson.id);
  }
}
