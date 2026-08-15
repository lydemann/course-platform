import { Injectable } from '@angular/core';
import { injectTRPCClient } from '@course-platform/shared/domain/trpc-client';

@Injectable({
  providedIn: 'root',
})
export class UserFacadeService {
  private readonly trpcClient = injectTRPCClient();

  createUser(email: string, password: string) {
    return this.trpcClient.user.createUser.mutate({ email, password });
  }
}
