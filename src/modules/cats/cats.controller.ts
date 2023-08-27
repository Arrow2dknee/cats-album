import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { imageFileFilter } from '@common/filters/imageFile.filter';
import { AuthGuard } from '@modules/auth/auth.guard';
import { User } from '@common/decorators/user.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@modules/users/enums/user.role';
import { UserDocument } from '@modules/users/schemas/users.schema';

import { CatsService } from './cats.service';
import { ICatImage } from './interfaces';

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
    @User() user: UserDocument,
  ): Promise<ICatImage> {
    return this.catsService.catImageUploader(file, user._id.toString());
  }
}
