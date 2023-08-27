import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Cat, CatDocument } from './schemas/cats.schema';
import { IImageMetadata } from './interfaces';

@Injectable()
export class CatsRepository {
  constructor(
    @InjectModel(Cat.name)
    private readonly catModel: Model<CatDocument>,
  ) {}

  async findCatImageByName(name: string, user: string): Promise<CatDocument> {
    return this.catModel
      .findOne({ fileName: name, owner: new Types.ObjectId(user) })
      .lean();
  }

  async findCatImage(id: string, user: string): Promise<CatDocument> {
    return this.catModel
      .findOne({
        _id: new Types.ObjectId(id),
        isDeleted: false,
        owner: new Types.ObjectId(user),
      })
      .populate('owner')
      .lean();
  }

  async catImageCount(user: string): Promise<number> {
    return this.catModel.countDocuments({
      owner: new Types.ObjectId(user),
      isDeleted: false,
    });
  }

  async findCatImages(
    limit: number,
    skip: number,
    user: string,
  ): Promise<CatDocument[]> {
    return this.catModel
      .find({
        owner: new Types.ObjectId(user),
        isDeleted: false,
      })
      .populate('owner')
      .limit(limit)
      .skip(skip)
      .sort({ updatedAt: -1 })
      .lean();
  }

  async uploadCatImage(dto: IImageMetadata): Promise<CatDocument> {
    return this.catModel.create({
      ...dto,
    });
  }

  async updateCatImage(id: string, dto: IImageMetadata): Promise<CatDocument> {
    return this.catModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        updatedAt: new Date(),
      },
      {
        new: true,
      },
    );
  }

  async softDeleteCatImage(id: string): Promise<void> {
    await this.catModel.findByIdAndUpdate(
      {
        _id: new Types.ObjectId(id),
      },
      {
        isDeleted: true,
        updatedAt: new Date(),
      },
      {
        new: true,
      },
    );
  }
}
