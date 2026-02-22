import { AuthUserDetails } from './auth-user-details.model';

export interface AuthStateModel {
  user: AuthUserDetails | null;
}
