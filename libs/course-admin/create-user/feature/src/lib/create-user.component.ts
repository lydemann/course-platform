import { Component, OnInit } from '@angular/core';
import {
  FormGroupDirective,
  NgForm,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserFacadeService } from '@course-platform/course-admin/shared/domain';
import { SharedModule } from '@course-platform/course-admin/shared/ui';

import { ToastService } from '@course-platform/shared/ui';

const NOT_SAME_ERROR_CODE = 'NOT_SAME';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(
      control?.parent?.invalid && control?.parent?.dirty
    );

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class CreateUserComponent implements OnInit {
  form!: UntypedFormGroup;
  serverError!: string;
  matcher = new MyErrorStateMatcher();
  passwordFormGroup!: UntypedFormGroup;
  isLoading!: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userFacadeService: UserFacadeService,
    private toastService: ToastService
  ) {}

  private checkPasswords(group: UntypedFormGroup) {
    // here we have the 'passwords' group
    const password = group.get('password')!.value;
    const confirmPassword = group.get('confirmPassword')!.value;

    return password === confirmPassword
      ? null
      : { [NOT_SAME_ERROR_CODE]: true };
  }

  ngOnInit() {
    this.passwordFormGroup = this.formBuilder.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.checkPasswords }
    );
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      passwordFormGroup: this.passwordFormGroup,
    });
  }

  onSubmit() {
    this.serverError = '';
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;
    this.isLoading = true;
    this.userFacadeService
      .createUser(formValue.email, formValue.passwordFormGroup.password)
      .subscribe(
        (response) => {
          this.isLoading = false;
          this.form.reset();
          this.toastService.showSuccessToast({
            message: 'User Registered',
            action: 'Go To App',
          });
        },
        (error: Error) => {
          this.isLoading = false;
          this.serverError = error.message;
        }
      );
  }

  getErrorMessage(control: UntypedFormControl) {
    if (control.hasError('required')) {
      return 'You must enter a value';
    }

    if (control.hasError(NOT_SAME_ERROR_CODE)) {
      return `Passwords doesn't match`;
    }

    if (control.hasError('email')) {
      return 'Not a valid email';
    }

    if (control?.parent?.hasError(NOT_SAME_ERROR_CODE)) {
      return `Passwords don't match`;
    }

    return Object.keys(control.errors!)[0];
  }
}
