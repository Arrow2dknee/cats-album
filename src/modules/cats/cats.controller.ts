import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Delete,
  Put,
  Get,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { imageFileFilter } from '@common/filters/imageFile.filter';
import { AuthGuard } from '@modules/auth/auth.guard';
import { User } from '@common/decorators/user.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@modules/users/enums/user.role';
import { PaginationDto } from '@dto/pagination.dto';
import { IUserInfo } from '@modules/users/interfaces';

import { CatsService } from './cats.service';
import { ICatImage, ICatImages } from './interfaces';
import { CatImageFileNameDto, CatImageIdDto } from './dto';

@Controller('cats')
@UseGuards(AuthGuard, RolesGuard)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post('/upload')
  @Roles(UserRole.user)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 10240000, // Setting max allowed file size of 10 MB
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @User() user: IUserInfo,
  ): Promise<ICatImage> {
    return this.catsService.catImageUploader(file, user.id);
  }

  @Put('/:id')
  @Roles(UserRole.user)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 10240000, // Setting max allowed file size of 10 MB
      },
    }),
  )
  async updateImage(
    @Param() { id }: CatImageIdDto,
    @UploadedFile() file: Express.Multer.File,
    @Body() bodyDto: CatImageFileNameDto,
    @User() user: IUserInfo,
  ): Promise<ICatImage> {
    return this.catsService.updateCatImage(id, file, user.id, bodyDto);
  }

  @Get('/:id')
  @Roles(UserRole.user)
  async getImageById(
    @Param() { id }: CatImageIdDto,
    @User() user: IUserInfo,
  ): Promise<ICatImage> {
    return this.catsService.getCatImage(id, user.id);
  }

  @Get()
  @Roles(UserRole.user)
  async getAllImages(
    @Query() dto: PaginationDto,
    @User() user: IUserInfo,
  ): Promise<ICatImages> {
    return this.catsService.getCatImages(dto, user.id);
  }

  @Delete('/:id')
  @Roles(UserRole.user)
  async removeImage(
    @Param() { id }: CatImageIdDto,
    @User() user: IUserInfo,
  ): Promise<string> {
    return this.catsService.removeCatImage(id, user.id);
  }
}
