import { User } from '@course-platform/shared/auth/domain';
import { Observable } from 'rxjs';

export interface ProfileService {
  getUserProfile: Observable<User>;
  updateName(fullName: string): void;
  updateEmail(newEmail: string, password: string): Promise<void>;
}
