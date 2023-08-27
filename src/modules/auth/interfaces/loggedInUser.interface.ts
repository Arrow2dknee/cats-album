import { UserRole } from '@modules/users/enums/user.role';

export interface ILoggedInUser {
  id: string;
  fullname: string;
  email: string;
  role: UserRole;
  token: string;
}
