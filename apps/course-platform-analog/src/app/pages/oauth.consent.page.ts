import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { authClient } from '@course-platform/shared/auth/domain';
import type { OAuthAuthorizationDetails } from '@supabase/auth-js';

@Component({
  selector: 'app-oauth-consent-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="consent-shell">
      <section class="consent-card" aria-labelledby="consent-title">
        @if (loading()) {
          <h1 id="consent-title">Loading authorization request…</h1>
          <p aria-live="polite">Checking your course account.</p>
        } @else if (errorMessage()) {
          <h1 id="consent-title">Authorization unavailable</h1>
          <p class="error" role="alert">{{ errorMessage() }}</p>
          <a href="/courses">Return to the course portal</a>
        } @else if (details(); as authorization) {
          <p class="eyebrow">Course content access</p>
          <h1 id="consent-title">
            Allow {{ authorization.client.name || 'this AI assistant' }}?
          </h1>
          <p>
            This application is asking to read the Angular course content and
            Vimeo transcripts available through your student account.
          </p>

          <dl>
            <div>
              <dt>Signed in as</dt>
              <dd>{{ authorization.user.email }}</dd>
            </div>
            <div>
              <dt>Application</dt>
              <dd>
                {{ authorization.client.name || authorization.client.id }}
              </dd>
            </div>
            <div>
              <dt>Redirect destination</dt>
              <dd class="url">{{ authorization.redirect_uri }}</dd>
            </div>
          </dl>

          @if (requestedScopes().length) {
            <div class="permissions">
              <strong>Requested permissions</strong>
              <ul>
                @for (scope of requestedScopes(); track scope) {
                  <li>{{ scope }}</li>
                }
              </ul>
            </div>
          }

          <p class="notice">
            Access is read-only. The assistant cannot change your account or
            course progress. You can revoke its access later in your account.
          </p>

          <div class="actions">
            <button
              class="deny"
              type="button"
              [disabled]="submitting()"
              (click)="decide('deny')"
            >
              Deny
            </button>
            <button
              class="approve"
              type="button"
              [disabled]="submitting()"
              (click)="decide('approve')"
            >
              {{ submitting() ? 'Working…' : 'Allow access' }}
            </button>
          </div>
        }
      </section>
    </main>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      background: #f5f7fb;
      color: #172033;
    }

    .consent-shell {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 2rem 1rem;
    }

    .consent-card {
      width: min(100%, 38rem);
      padding: 2rem;
      border: 1px solid #dfe4ef;
      border-radius: 1rem;
      background: white;
      box-shadow: 0 1rem 3rem rgb(20 32 58 / 10%);
    }

    .eyebrow {
      margin: 0 0 0.5rem;
      color: #4054b2;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0 0 1rem;
      font-size: clamp(1.75rem, 5vw, 2.25rem);
      line-height: 1.15;
    }

    dl {
      display: grid;
      gap: 0.85rem;
      margin: 1.5rem 0;
    }

    dl div {
      display: grid;
      gap: 0.25rem;
    }

    dt {
      color: #5b6475;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    dd {
      margin: 0;
      font-weight: 600;
    }

    .url {
      overflow-wrap: anywhere;
    }

    .permissions,
    .notice {
      padding: 1rem;
      border-radius: 0.75rem;
      background: #f1f4ff;
    }

    .permissions ul {
      margin-bottom: 0;
    }

    .notice {
      color: #414b60;
      font-size: 0.9rem;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    button {
      min-width: 7rem;
      padding: 0.75rem 1rem;
      border: 1px solid #4054b2;
      border-radius: 0.5rem;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    button:disabled {
      cursor: wait;
      opacity: 0.65;
    }

    .deny {
      background: white;
      color: #4054b2;
    }

    .approve {
      background: #4054b2;
      color: white;
    }

    .error {
      color: #a11313;
    }
  `,
})
export default class OAuthConsentPageComponent implements OnInit {
  readonly details = signal<OAuthAuthorizationDetails | null>(null);
  readonly errorMessage = signal('');
  readonly loading = signal(true);
  readonly requestedScopes = signal<string[]>([]);
  readonly submitting = signal(false);

  private authorizationId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    this.authorizationId =
      this.route.snapshot.queryParamMap.get('authorization_id') ?? '';
    if (!this.authorizationId) {
      this.fail('The authorization request is missing its authorization ID.');
      return;
    }

    try {
      const { data: userData, error: userError } = await authClient.getUser();
      if (userError || !userData.user) {
        await this.router.navigate(['/login'], {
          queryParams: { redirect: this.router.url },
        });
        return;
      }

      const { data, error } = await authClient.oauth.getAuthorizationDetails(
        this.authorizationId,
      );
      if (error || !data) {
        this.fail(error?.message ?? 'The authorization request is invalid.');
        return;
      }

      if (!('authorization_id' in data)) {
        window.location.assign(data.redirect_url);
        return;
      }

      this.details.set(data);
      this.requestedScopes.set(data.scope.split(' ').filter(Boolean));
      this.loading.set(false);
    } catch (error) {
      this.fail(
        error instanceof Error
          ? error.message
          : 'Could not load the authorization request.',
      );
    }
  }

  async decide(decision: 'approve' | 'deny'): Promise<void> {
    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');
    try {
      const response =
        decision === 'approve'
          ? await authClient.oauth.approveAuthorization(this.authorizationId, {
              skipBrowserRedirect: true,
            })
          : await authClient.oauth.denyAuthorization(this.authorizationId, {
              skipBrowserRedirect: true,
            });

      if (response.error || !response.data) {
        throw response.error ?? new Error('Authorization decision failed.');
      }

      window.location.assign(response.data.redirect_url);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error
          ? error.message
          : 'Could not complete the authorization request.',
      );
      this.submitting.set(false);
    }
  }

  private fail(message: string): void {
    this.errorMessage.set(message);
    this.loading.set(false);
  }
}
