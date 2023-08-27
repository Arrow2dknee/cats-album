import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cat, CatDocument } from './schemas/cats.schema';
import { IImageMetadata } from './interfaces';

@Injectable()
export class CatsRepository {
  constructor(
    @InjectModel(Cat.name)
    private readonly catModel: Model<CatDocument>,
  ) {}

  async uploadCatImage(dto: IImageMetadata): Promise<CatDocument> {
    return this.catModel.create({
      ...dto,
    });
  }
}
