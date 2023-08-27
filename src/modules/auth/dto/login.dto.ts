import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ERROR } from '@messages/error.messages';

export class LoginDto {
  @Matches(new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/), {
    message: ERROR.USER.EMAIL_CRITERIA,
  })
  @MaxLength(255)
  @MinLength(5)
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @Matches(
    new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#)<>,'.{[$@(\]}\/;:\\|"!%&^*?_+-~èéêëēėęÿûüùúūîïíīįìôöòóœøōõàáâãåāßśšłžźżçćčñń°–—•€£¥₩₽§""„»«…¿¡''`‰]{10,15}$/i,
    ),
    {
      message: ERROR.USER.PASSWORD_CRITERIA,
    },
  )
  @MaxLength(60)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
