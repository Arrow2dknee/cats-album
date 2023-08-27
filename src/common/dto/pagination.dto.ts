import { IsNotEmpty, IsNumberString } from 'class-validator';

export class PaginationDto {
  @IsNumberString()
  @IsNotEmpty()
  readonly limit: string;

  @IsNumberString()
  @IsNotEmpty()
  readonly page: string;
}
