import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { UserRole } from '@modules/users/enums/user.role';
import { KEY } from '@common/decorators/roles.decorator';
import { ERROR } from '@messages/error.messages';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (user.role !== roles[0])
      throw new ForbiddenException(ERROR.EXCEPTION.INSUFFICIENT_PERMISSIONS);
    return true;
  }
}
