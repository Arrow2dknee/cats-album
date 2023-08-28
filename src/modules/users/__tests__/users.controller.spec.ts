import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '@modules/auth/auth.service';
import { AuthGuard } from '@modules/auth/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';

import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { mockUser } from './mockData';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        UsersController,
        {
          provide: UsersService,
          useValue: {
            getUsers: jest.fn().mockResolvedValue({
              totalRecords: 1,
              totalPages: 1,
              currentPage: 1,
              limit: 10,
              users: [mockUser],
            }),
          },
        },
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: AuthGuard,
          useValue: {},
        },
        {
          provide: RolesGuard,
          useValue: {},
        },
      ],
      exports: [],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('Should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('Get active users', () => {
    it('should return a list of all active users with pagination', async () => {
      await expect(
        usersController.activeUsers({ limit: '10', page: '1' }),
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
