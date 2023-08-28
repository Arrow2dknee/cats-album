import { UserRole } from '../enums/user.role';

export interface IUserInfo {
  id: string;
  fullname: string;
  email: string;
  role: UserRole;
}
