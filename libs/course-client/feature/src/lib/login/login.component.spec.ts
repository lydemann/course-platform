import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthService } from '@course-platform/shared/auth/domain';
import { getSafePostLoginRedirect, LoginComponent } from './login.component';

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


describe('getSafePostLoginRedirect', () => {
  it('preserves an internal OAuth consent return URL', () => {
    expect(
      getSafePostLoginRedirect('/oauth/consent?authorization_id=request-1'),
    ).toBe('/oauth/consent?authorization_id=request-1');
  });

  it.each([null, '', 'https://attacker.example', '//attacker.example'])(
    'falls back to courses for unsafe redirect %p',
    (redirect) => {
      expect(getSafePostLoginRedirect(redirect)).toBe('/courses');
    },
  );
});
