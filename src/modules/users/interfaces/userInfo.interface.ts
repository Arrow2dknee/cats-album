import { UserRole } from '../enums/user.role';

export interface IUserInfo {
  fullname: string;
  email: string;
  role: UserRole;
}
