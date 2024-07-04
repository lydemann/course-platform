import { Observable } from 'rxjs';

export interface Profile {
  fullName: string;
  email: string;
  id: string;
}

export abstract class ProfileService {
  abstract getUserProfile(): Observable<Profile>;
  abstract updateName(fullName: string): void;
  abstract updateEmail(newEmail: string, password: string): Promise<void>;
  abstract updatePassword(
    newPassword: string,
    oldPassword: string
  ): Promise<void>;
}
