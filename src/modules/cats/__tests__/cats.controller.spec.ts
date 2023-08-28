import { Test, TestingModule } from '@nestjs/testing';

import { SUCCESS } from '@messages/success.messages';
import { AuthService } from '@modules/auth/auth.service';
import { AuthGuard } from '@modules/auth/auth.guard';

import { CatsService } from '../cats.service';
import { CatsController } from '../cats.controller';
import {
  mockCatImageId,
  mockCatImageInfo,
  mockFile,
  mockLoggedInUser,
} from './mockData';

describe('CatsController', () => {
  let catsController: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        CatsController,
        {
          provide: CatsService,
          useValue: {
            catImageUploader: jest.fn().mockResolvedValue(mockCatImageInfo),
            updateCatImage: jest.fn().mockResolvedValue(mockCatImageInfo),
            getCatImage: jest.fn().mockResolvedValue(mockCatImageInfo),
            getCatImages: jest.fn().mockResolvedValue({
              totalRecords: 1,
              totalPages: 1,
              currentPage: 1,
              limit: 10,
              cats: [mockCatImageInfo],
            }),
            removeCatImage: jest.fn().mockResolvedValue(SUCCESS.CATS.REMOVED),
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
      ],
      exports: [],
    }).compile();

    catsController = module.get<CatsController>(CatsController);
    catsService = module.get<CatsService>(CatsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(catsController).toBeDefined();
  });

  describe('Upload cat image', () => {
    it('should upload cat image and return image metadata', async () => {
      await expect(
        catsController.uploadImage(mockFile, mockLoggedInUser),
      ).resolves.toEqual(mockCatImageInfo);
    });
  });

  describe('Update cat image', () => {
    it('should update cat image and return updated image metadata', async () => {
      await expect(
        catsController.updateImage(
          { id: mockCatImageId },
          mockFile,
          { fileName: null },
          mockLoggedInUser,
        ),
      ).resolves.toEqual(mockCatImageInfo);
    });
  });

  describe('Get cat image by id', () => {
    it('should return cat image if it exists', async () => {
      await expect(
        catsController.getImageById({ id: mockCatImageId }, mockLoggedInUser),
      ).resolves.toEqual(mockCatImageInfo);
    });
  });

  describe('Get cat images', () => {
    it('should return a list of cat images with pagination', async () => {
      await expect(
        catsController.getAllImages(
          { limit: '10', page: '1' },
          mockLoggedInUser,
        ),
      ).resolves.toEqual({
        totalRecords: 1,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        cats: [mockCatImageInfo],
      });
    });
  });

  describe('Remove cat image', () => {
    it('should return a success message after removing selected cat image', async () => {
      await expect(
        catsController.removeImage({ id: mockCatImageId }, mockLoggedInUser),
      ).resolves.toEqual(SUCCESS.CATS.REMOVED);
    });
  });
});
