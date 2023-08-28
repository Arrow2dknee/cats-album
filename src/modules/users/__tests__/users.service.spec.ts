import { Test, TestingModule } from '@nestjs/testing';

import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';
import { mockUser, mockUserEmail, mockUserName, mockUserPwd } from './mockData';
import { UserRole } from '../enums/user.role';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findUserByName: jest.fn().mockResolvedValue(mockUser),
            findUserByEmail: jest.fn().mockResolvedValue(mockUser),
            findUserForVerification: jest.fn().mockResolvedValue({
              ...mockUser,
              password: mockUserPwd,
            }),
            addUser: jest.fn().mockResolvedValue(mockUser),
            getActiveUsersCount: jest.fn().mockResolvedValue(1),
            getActiveUsers: jest.fn().mockResolvedValue([mockUser]),
          },
        },
      ],
      exports: [],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('Should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('Get user by name', () => {
    it('should return user by name', async () => {
      await expect(usersService.getUserByName(mockUserName)).resolves.toEqual(
        mockUser,
      );
    });
  });

  describe('Get user by email', () => {
    it('should return user by email', async () => {
      await expect(usersService.getUserByEmail(mockUserEmail)).resolves.toEqual(
        mockUser,
      );
    });
  });

  describe('Get user by email for password verification purposes', () => {
    it('should return user by email', async () => {
      await expect(
        usersService.getUserForVerification(mockUserEmail),
      ).resolves.toEqual({
        ...mockUser,
        password: mockUserPwd,
      });
    });
  });

  describe('Create new user', () => {
    it('should create new user record', async () => {
      await expect(
        usersService.createUser({
          fullname: 'anto',
          email: 'antismyname@gmail.com',
          password: 'Test@12345',
          role: UserRole.user,
        }),
      ).resolves.toEqual(mockUser);
    });
  });

  describe('Get active users list', () => {
    it('should return a list of all active users', async () => {
      await expect(
        usersService.getUsers({ limit: '10', page: '1' }),
      ).resolves.toEqual({
        totalRecords: 1,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        users: [mockUser],
      });
    });
  });
});
