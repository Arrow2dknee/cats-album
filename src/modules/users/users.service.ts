import { Injectable } from '@nestjs/common';

import { RegisterDto } from '@modules/auth/dto';
import { PaginationDto } from '@dto/pagination.dto';

import { UsersRepository } from './users.repository';
import { UserDocument } from './schemas/users.schema';
import { IActiveUsers } from './interfaces';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserByName(name: string): Promise<UserDocument> {
    return this.usersRepository.findUserByName(name);
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    return this.usersRepository.findUserByEmail(email);
  }

  async getUserForVerification(email: string): Promise<UserDocument> {
    return this.usersRepository.findUserForVerification(email);
  }

  async createUser(dto: RegisterDto): Promise<UserDocument> {
    return this.usersRepository.addUser(dto);
  }

  async getUsers(queryDto: PaginationDto): Promise<IActiveUsers> {
    const { page = '1', limit = '10' } = queryDto;
    const resultsPerPage = parseInt(limit);
    const currentPage = parseInt(page) - 1;
    const skip = resultsPerPage * currentPage;
    const totalRecords: number =
      await this.usersRepository.getActiveUsersCount();

    const list = await this.usersRepository.getActiveUsers(
      resultsPerPage,
      skip,
    );

    return {
      totalRecords,
      totalPages: Math.ceil(totalRecords / resultsPerPage),
      currentPage: parseInt(page),
      limit: resultsPerPage,
      users: list,
    };
  }
}
