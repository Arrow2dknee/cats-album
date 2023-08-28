import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UsersRepository } from '../users.repository';
import { User, UserDocument } from '../schemas/users.schema';
import { mockUser, mockUserEmail, mockUserName, mockUserPwd } from './mockData';
import { UserRole } from '../enums/user.role';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        UsersRepository,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn().mockImplementation(() => ({
              select: jest.fn().mockImplementation(() => ({
                lean: jest.fn().mockResolvedValue({
                  ...mockUser,
                  password: mockUserPwd,
                }),
              })),
            })),
            create: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockImplementation(() => ({
              limit: jest.fn().mockImplementation(() => ({
                skip: jest.fn().mockImplementation(() => ({
                  sort: jest.fn().mockImplementation(() => ({
                    exec: jest.fn().mockResolvedValue([mockUser]),
                  })),
                })),
              })),
            })),
            countDocuments: jest.fn().mockResolvedValue(1),
          },
        },
      ],
      exports: [],
    }).compile();

    usersRepository = module.get<UsersRepository>(UsersRepository);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('Should be defined', () => {
    expect(usersRepository).toBeDefined();
  });

  describe('Get user by name', () => {
    it('should return a user by name', async () => {
      userModel.findOne = jest.fn().mockImplementation(() => ({
        lean: jest.fn().mockResolvedValue(mockUser),
      }));

      await expect(
        usersRepository.findUserByName(mockUserName),
      ).resolves.toEqual(mockUser);
    });
  });

  describe('Get user by email', () => {
    it('should return a user by email', async () => {
      userModel.findOne = jest.fn().mockImplementation(() => ({
        lean: jest.fn().mockResolvedValue(mockUser),
      }));

      await expect(
        usersRepository.findUserByName(mockUserEmail),
      ).resolves.toEqual(mockUser);
    });
  });

  describe('Get user with password field for validation purposes', () => {
    it('should return user with password field', async () => {
      await expect(
        usersRepository.findUserForVerification(mockUserEmail),
      ).resolves.toEqual({
        ...mockUser,
        password: mockUserPwd,
      });
    });
  });

  describe('Create user', () => {
    it('should create new user document', async () => {
      await expect(
        usersRepository.addUser({
          fullname: 'anto',
          email: 'antismyname@gmail.com',
          password: 'Test@12345',
          role: UserRole.user,
        }),
      ).resolves.toEqual(mockUser);
    });
  });

  describe('Get active users', () => {
    it('should return a list of active users', async () => {
      await expect(usersRepository.getActiveUsers(10, 1)).resolves.toEqual([
        mockUser,
      ]);
    });
  });

  describe('Get active users count', () => {
    it('should return count of active users', async () => {
      await expect(usersRepository.getActiveUsersCount()).resolves.toEqual(1);
    });
  });
});
