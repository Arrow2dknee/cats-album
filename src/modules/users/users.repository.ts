import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RegisterDto } from '@modules/auth/dto';

import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findUserByName(name: string): Promise<UserDocument> {
    return this.userModel
      .findOne({
        fullname: name.toLowerCase(),
      })
      .lean();
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    return this.userModel
      .findOne({
        email,
      })
      .lean();
  }

  async findUserForVerification(email: string): Promise<UserDocument> {
    return this.userModel
      .findOne({
        email,
      })
      .select({
        _id: 1,
        fullname: 1,
        email: 1,
        password: 1,
        role: 1,
      })
      .lean();
  }

  async addUser(dto: RegisterDto): Promise<UserDocument> {
    return this.userModel.create({
      ...dto,
    });
  }

  async getActiveUsers(limit: number, skip: number): Promise<UserDocument[]> {
    return this.userModel
      .find()
      .limit(limit)
      .skip(skip)
      .sort({ updatedAt: -1 })
      .exec();
  }

  async getActiveUsersCount(): Promise<number> {
    return this.userModel.countDocuments();
  }
}
