import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

import { UsersService } from '@modules/users/users.service';
import { IUserInfo } from '@modules/users/interfaces';
import { ERROR } from '@messages/error.messages';

import { RegisterDto, LoginDto } from './dto';
import { ILoggedInUser, IValidateUser } from './interfaces';
import { JWTService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JWTService,
  ) {}

  async newUserRegistration(dto: RegisterDto): Promise<IUserInfo> {
    const { fullname, email, password, role } = dto;

    const userWithSimilarName = await this.usersService.getUserByName(fullname);
    if (userWithSimilarName) {
      throw new BadRequestException({
        message: ERROR.USER.NAME_TAKEN,
      });
    }
    const userWithSimilarEmail = await this.usersService.getUserByEmail(email);
    if (userWithSimilarEmail) {
      throw new BadRequestException({
        message: ERROR.USER.EMAIL_TAKEN,
      });
    }

    const payload: RegisterDto = {
      fullname: fullname.toLowerCase(),
      email,
      password: this.jwtService.encodePassword(password),
      role,
    };
    const newUser = await this.usersService.createUser(payload);

    return {
      id: newUser._id.toString(),
      fullname: payload.fullname,
      email: payload.email,
      role: payload.role,
    };
  }

  async loginUser(dto: LoginDto): Promise<ILoggedInUser> {
    const { email, password } = dto;

    const user = await this.usersService.getUserForVerification(email);

    if (!user) {
      throw new NotFoundException({
        message: ERROR.USER.INCORRECT_PASSWORD,
      });
    }

    const doesPwdMatch = this.jwtService.comparePassword(
      password,
      user.password,
    );

    if (!doesPwdMatch) {
      throw new BadRequestException({
        message: ERROR.USER.INCORRECT_PASSWORD,
      });
    }

    return {
      id: user._id.toString(),
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      token: this.jwtService.generateToken(user),
    };
  }

  public async validateUserByToken(token: string): Promise<IValidateUser> {
    const decodedUser = await this.jwtService.verify(token);

    if (!decodedUser) {
      throw new BadRequestException({
        message: ERROR.AUTH.INVALID_TOKEN,
      });
    }
    const user = await this.usersService.getUserByEmail(decodedUser.email);

    if (!user) {
      throw new NotFoundException({
        message: ERROR.USER.USER_NOT_FOUND,
      });
    }

    return {
      user: {
        id: user._id.toString(),
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
      status: HttpStatus.OK,
    };
  }
}
