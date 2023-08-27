import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@modules/users/enums/user.role';

export const KEY = 'userRole';
export const Roles = (...roles: UserRole[]) => SetMetadata(KEY, roles);
