import { HttpStatus } from '@nestjs/common';

import { IUserInfo } from '@modules/users/interfaces';

export interface IValidateUser {
  user: IUserInfo;
  status: HttpStatus;
}
