import { HttpStatus } from '@nestjs/common';

import { UserDocument } from '@modules/users/schemas/users.schema';

export interface IValidateUser {
  user: UserDocument;
  status: HttpStatus;
}
