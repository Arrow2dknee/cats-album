import { UserRole } from '../enums/user.role';

export const mockUserId = '64eb36f92286f61093eb3482';

export const mockUserName = 'anto';

export const mockUserEmail = 'antismyname@gmail.com';

export const mockUserPwd =
  '$2a$10$zkXtLX2Pcz6C3RjTTXGoduVhAofbvNuZCjX2fPCKASyiJGyuyA0Oi';

export const mockUser = {
  _id: '64eb36f92286f61093eb3482',
  fullname: 'anto',
  email: 'antismyname@gmail.com',
  role: UserRole.user,
  createdAt: '2023-08-27T11:45:17.905+00:00',
  updatedAt: '2023-08-27T11:56:26.729+00:00',
};
