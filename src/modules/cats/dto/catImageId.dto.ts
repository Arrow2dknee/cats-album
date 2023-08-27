import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CatImageIdDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly id: string;
}
