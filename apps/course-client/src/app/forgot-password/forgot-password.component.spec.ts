import { waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  byTestId,
  createComponentFactory,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponents } from 'ng-mocks';

import { AuthService } from '@course-platform/shared/feat-auth';
import { ButtonComponent } from '@course-platform/shared/ui';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let spectator: Spectator<ForgotPasswordComponent>;
  const createComponent = createComponentFactory({
    component: ForgotPasswordComponent,
    imports: [ReactiveFormsModule],
    mocks: [AuthService],
    declarations: [MockComponents(ButtonComponent)],
  });

  beforeEach(() => (spectator = createComponent()));

  describe('Reset password', () => {
    it('should show reset password text on reset', waitForAsync(async () => {
      spectator.typeInElement('abcd@abcd.dk', byTestId('email'));

      spectator.component.sendResetPasswordEmail(new Event(''));

      await spectator.fixture.whenStable();
      spectator.detectChanges();

      const confirmationText = spectator.query(byTestId('confirmation'));

      expect(confirmationText).toMatchInlineSnapshot(`
          <p
            class="center"
            data-testid="confirmation"
          >
             Password reset mail has been sent 
          </p>
        `);
    }));
  });
});
