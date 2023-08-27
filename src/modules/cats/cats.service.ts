import { Injectable, BadRequestException } from '@nestjs/common';

import { ERROR } from '@messages/error.messages';

import { CatsRepository } from './cats.repository';
import { IImageMetadata, ICatImage } from './interfaces';
import { CatDocument } from './schemas/cats.schema';

@Injectable()
export class CatsService {
  constructor(private readonly catsRepository: CatsRepository) {}

  async catImageUploader(
    file: Express.Multer.File,
    loggedInUserId: string,
  ): Promise<ICatImage> {
    if (!file) {
      throw new BadRequestException(ERROR.CATS.IMAGE_REQUIRED);
    }

    const uploadedImage: IImageMetadata = {
      fileName: file.originalname,
      mimeType: file.mimetype,
      metadata: file.buffer,
      fileSize: file.size, // in bytes
      owner: loggedInUserId,
    };
    const catImage: CatDocument = await this.catsRepository.uploadCatImage(
      uploadedImage,
    );

    return {
      id: catImage._id.toString(),
      fileName: catImage.fileName,
      mimeType: catImage.mimeType,
      owner: loggedInUserId,
      lastUpdated: new Date(),
    };
  }
}
