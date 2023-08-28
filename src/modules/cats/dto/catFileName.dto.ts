import { IsOptional, IsString } from 'class-validator';

export class CatImageFileNameDto {
  @IsString()
  @IsOptional()
  readonly fileName: string;
}
