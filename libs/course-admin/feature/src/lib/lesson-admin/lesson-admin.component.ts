import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormArray,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { CourseAdminFacadeService } from '@course-platform/course-admin/shared/domain';
import { Lesson, LessonResourceType } from '@course-platform/shared/interfaces';
import { Observable } from 'rxjs';

export type ResourceFormGroup = FormGroup<{
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  url: FormControl<string | null>;
  type: FormControl<LessonResourceType | null>;
}>;

export type LessonAdminResourcesFormArray = FormArray<ResourceFormGroup>;

export type LessonAdminForm = FormGroup<{
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  videoUrl: FormControl<string | null>;
  resources: LessonAdminResourcesFormArray;
}>;

@Component({
  selector: 'app-lesson-admin',
  templateUrl: './lesson-admin.component.html',
  styleUrls: ['./lesson-admin.component.scss'],
})
export class LessonAdminComponent {
  lesson$ = this.courseAdminFacade.currentLesson$;
  formGroup$: Observable<LessonAdminForm> = combineLatest([this.lesson$]).pipe(
    filter(([lesson]) => !!lesson),
    map(([lesson]) => {
      return this.formBuilder.group({
        name: [lesson.name, Validators.required],
        description: [lesson.description, Validators.required],
        videoUrl: [lesson.videoUrl, Validators.required],
        resources: this.formBuilder.array(
          (lesson.resources || [])?.map((resource) => {
            return this.formBuilder.group({
              id: [resource.id],
              name: [resource.name],
              url: [resource.url],
              type: [resource.type],
            });
          })
        ),
      });
    })
  );

  isAddingResource$ = new BehaviorSubject(false);
  constructor(
    private courseAdminFacade: CourseAdminFacadeService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  goBack() {
    this.courseAdminFacade.goToCourseAdmin();
  }

  submit(formGroup: UntypedFormGroup, lesson: Lesson) {
    // TODO: show spinner
    this.courseAdminFacade.saveLesson(
      {
        id: lesson.id,
        ...formGroup.value,
      } as Lesson,
      this.route.snapshot.params['sectionId']
    );
    this.isAddingResource$.next(false);
  }

  onAddResourceClicked() {
    this.isAddingResource$.next(true);
  }

  onDeleteResourceClicked(resourceId: string, form: UntypedFormGroup) {
    const resourcesFormGroups = (form.get('resources') as UntypedFormArray)
      .controls as UntypedFormGroup[];

    const idxToRemove = resourcesFormGroups.findIndex(
      (group) => group.get('id')?.value === resourceId
    );

    (form.get('resources') as UntypedFormArray).removeAt(idxToRemove);
  }

  onDelete(lesson: Lesson) {
    const sectionId = this.route.snapshot.params['sectionId'];
    this.courseAdminFacade.deleteLessonClicked(sectionId, lesson.id);
  }
}
