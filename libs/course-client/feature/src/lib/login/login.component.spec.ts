import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthService } from '@course-platform/shared/auth/domain';
import { LoginComponent } from './login.component';

describe('LoginComponent with zoneless change detection', () => {
  it('renders a returned authentication error after the async request', async () => {
    const authService = {
      signIn: jest
        .fn()
        .mockResolvedValue({ error: { message: 'Invalid credentials' } }),
    };
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(LoginComponent);
    await fixture.whenStable();
    fixture.componentInstance.signIn({
      email: 'student@example.com',
      password: 'incorrect',
    });
    await authService.signIn.mock.results[0].value;
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.error').textContent).toContain(
      'Invalid credentials',
    );
  });
});
