import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { UserFacadeService } from '@course-platform/course-admin-lib';

const NOT_SAME_ERROR_CODE = 'NOT_SAME';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
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
})
export class CreateUserComponent implements OnInit {
  form: FormGroup;
  serverError: string;
  matcher = new MyErrorStateMatcher();
  passwordFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userFacadeService: UserFacadeService
  ) {}

  private checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;

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
    this.serverError = null;
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;
    this.userFacadeService
      .createUser(formValue.email, formValue.password)
      .subscribe(
        (response) => {
          // TODO: toast user created
        },
        (error: Error) => {
          this.serverError = error.message;
        }
      );
  }

  getErrorMessage(control: FormControl) {
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

    return Object.keys(control?.errors)[0];
  }
}
