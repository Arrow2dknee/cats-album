import { Controller, Post, Body } from '@nestjs/common';

import { IUserInfo } from '@modules/users/interfaces';

import { RegisterDto, LoginDto } from './dto';
import { AuthService } from './auth.service';
import { ILoggedInUser } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerUser(@Body() dto: RegisterDto): Promise<IUserInfo> {
    return this.authService.newUserRegistration(dto);
  }

  @Post('/login')
  async loginUser(@Body() dto: LoginDto): Promise<ILoggedInUser> {
    return this.authService.loginUser(dto);
  }
}
