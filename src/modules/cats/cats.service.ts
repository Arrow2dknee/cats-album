import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { ERROR } from '@messages/error.messages';
import { PaginationDto } from '@dto/pagination.dto';
import { SUCCESS } from '@messages/success.messages';

import { CatsRepository } from './cats.repository';
import { IImageMetadata, ICatImage, ICatImages } from './interfaces';
import { CatDocument } from './schemas/cats.schema';
import { CatImageFileNameDto } from './dto';

@Injectable()
export class CatsService {
  constructor(private readonly catsRepository: CatsRepository) {}

  private catImageInfo(catImage: CatDocument): ICatImage {
    return {
      id: catImage._id.toString(),
      fileName: catImage.fileName,
      mimeType: catImage.mimeType,
      owner: catImage.owner.fullname,
      lastUpdated: catImage['updatedAt'],
    };
  }

  private async validateImageFileName(
    name: string,
    user: string,
  ): Promise<void> {
    const doesImageExists = await this.catsRepository.findCatImageByName(
      name,
      user,
    );
    if (doesImageExists) {
      throw new BadRequestException(ERROR.CATS.FILENAME_EXISTS);
    }
  }

  async catImageUploader(
    file: Express.Multer.File,
    loggedInUserId: string,
  ): Promise<ICatImage> {
    if (!file) {
      throw new BadRequestException(ERROR.CATS.IMAGE_REQUIRED);
    }
    await this.validateImageFileName(file.originalname, loggedInUserId);

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

  async validateCatImageId(id: string, user: string): Promise<CatDocument> {
    const catImage = await this.catsRepository.findCatImage(id, user);

    if (!catImage) {
      throw new NotFoundException(ERROR.CATS.NOT_FOUND);
    }

    return catImage;
  }

  async updateCatImage(
    id: string,
    file: Express.Multer.File,
    loggedInUser: string,
    bodydto: CatImageFileNameDto,
  ): Promise<ICatImage> {
    let { fileName: newFileName } = bodydto;
    const existingImage = await this.validateCatImageId(id, loggedInUser);
    let catImage = null;
    const newCatImage: IImageMetadata = {
      fileName: null,
      mimeType: null,
      metadata: null,
      fileSize: null,
      owner: null,
    };

    if (file && !newFileName) {
      await this.validateImageFileName(file.originalname, loggedInUser);
      Object.assign(newCatImage, {
        fileName: file.originalname,
        mimeType: file.mimetype,
        metadata: file.buffer,
        fileSize: file.size, // in bytes
        owner: loggedInUser,
      });
      catImage = await this.catsRepository.updateCatImage(id, newCatImage);
    } else if (!file && newFileName) {
      newFileName = newFileName.trim().replaceAll(' ', '');
      await this.validateImageFileName(newFileName, loggedInUser);

      Object.assign(newCatImage, {
        fileName: newFileName,
        mimeType: existingImage.mimeType,
        metadata: existingImage.metadata,
        fileSize: existingImage.fileSize,
        owner: loggedInUser,
      });
      catImage = await this.catsRepository.updateCatImage(id, newCatImage);
    } else if (file && newFileName) {
      newFileName = newFileName.trim().replaceAll(' ', '');
      await this.validateImageFileName(newFileName, loggedInUser);

      Object.assign(newCatImage, {
        fileName: newFileName,
        mimeType: file.mimetype,
        metadata: file.buffer,
        fileSize: file.size,
        owner: loggedInUser,
      });
      catImage = await this.catsRepository.updateCatImage(id, newCatImage);
    } else if (!file && !newFileName) {
      throw new BadRequestException(ERROR.CATS.MISSING_INFO);
    }

    return {
      id: catImage._id.toString(),
      fileName: catImage.fileName,
      mimeType: catImage.mimeType,
      owner: loggedInUser,
      lastUpdated: catImage['updatedAt'],
    };
  }

  async getCatImage(id: string, loggedInUser: string): Promise<ICatImage> {
    const catImage = await this.validateCatImageId(id, loggedInUser);

    return this.catImageInfo(catImage);
  }

  async getCatImages(
    dto: PaginationDto,
    loggedInUser: string,
  ): Promise<ICatImages> {
    const { limit = '10', page = '1' } = dto;
    const resultsPerPage = parseInt(limit);
    const currentPage = parseInt(page) - 1;
    const skip = resultsPerPage * currentPage;
    const totalRecords: number = await this.catsRepository.catImageCount(
      loggedInUser,
    );

    const list = await this.catsRepository.findCatImages(
      resultsPerPage,
      skip,
      loggedInUser,
    );
    const catImages = list.map((catImage) => this.catImageInfo(catImage));

    return {
      totalRecords,
      totalPages: Math.ceil(totalRecords / resultsPerPage),
      currentPage: parseInt(page),
      limit: resultsPerPage,
      cats: catImages,
    };
  }

  async removeCatImage(id: string, loggedInUser: string): Promise<string> {
    await this.validateCatImageId(id, loggedInUser);
    await this.catsRepository.softDeleteCatImage(id);

    return SUCCESS.CATS.REMOVED;
  }
}
