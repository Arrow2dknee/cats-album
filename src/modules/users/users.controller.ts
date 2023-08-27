import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { PaginationDto } from '@dto/pagination.dto';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@modules/users/enums/user.role';
import { AuthGuard } from '@modules/auth/auth.guard';

import { UsersService } from './users.service';
import { IActiveUsers } from './interfaces';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/active')
  @Roles(UserRole.admin)
  async activeUsers(@Query() queryDto: PaginationDto): Promise<IActiveUsers> {
    return this.usersService.getUsers(queryDto);
  }
}
