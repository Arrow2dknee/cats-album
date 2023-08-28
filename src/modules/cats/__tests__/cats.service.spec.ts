import { Test, TestingModule } from '@nestjs/testing';

import { ERROR } from '@messages/error.messages';
import { SUCCESS } from '@messages/success.messages';

import { CatsService } from '../cats.service';
import { CatsRepository } from '../cats.repository';
import {
  mockCatImage,
  mockCatImageId,
  mockCatImageInfo,
  mockFile,
  mockImageOwner,
} from './mockData';

describe('CatsService', () => {
  let catsService: CatsService;
  let catsRepository: CatsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        CatsService,
        {
          provide: CatsRepository,
          useValue: {
            findCatImageByName: jest.fn().mockResolvedValue(null),
            uploadCatImage: jest.fn().mockResolvedValue(mockCatImage),
            findCatImage: jest.fn().mockResolvedValue(mockCatImage),
            updateCatImage: jest.fn().mockResolvedValue(mockCatImage),
            catImageCount: jest.fn().mockResolvedValue(1),
            findCatImages: jest.fn().mockResolvedValue([
              {
                ...mockCatImage,
                owner: { id: mockImageOwner, fullname: 'derek' },
              },
            ]),
            softDeleteCatImage: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
      exports: [],
    }).compile();

    catsService = module.get<CatsService>(CatsService);
    catsRepository = module.get<CatsRepository>(CatsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(catsService).toBeDefined();
  });

  describe('Upload cat image', () => {
    it('should upload a cat image uploaded by logged-in user', async () => {
      await expect(
        catsService.catImageUploader(mockFile, mockImageOwner),
      ).resolves.toEqual({
        ...mockCatImageInfo,
        owner: mockImageOwner,
        lastUpdated: new Date(),
      });
    });
  });

  describe('Validate cat image id', () => {
    it('should throw an error if cat image id cannot be found', async () => {
      catsRepository.findCatImage = jest.fn().mockResolvedValue(null);

      await expect(
        catsService.validateCatImageId(mockCatImageId, mockImageOwner),
      ).rejects.toThrowError(ERROR.CATS.NOT_FOUND);
    });

    it('should validate and return cat image id', async () => {
      await expect(
        catsService.validateCatImageId(mockCatImageId, mockImageOwner),
      ).resolves.toEqual(mockCatImage);
    });
  });

  describe('Update cat image', () => {
    it('should throw an error when both file and new file name is missing', async () => {
      await expect(
        catsService.updateCatImage(mockCatImageId, null, mockImageOwner, {
          fileName: null,
        }),
      ).rejects.toThrowError(ERROR.CATS.MISSING_INFO);
    });

    it('should update file metadata when only file is provided', async () => {
      await expect(
        catsService.updateCatImage(mockCatImageId, mockFile, mockImageOwner, {
          fileName: null,
        }),
      ).resolves.toEqual({
        ...mockCatImageInfo,
        owner: mockImageOwner,
      });
    });

    it('should update file when both file and new file name is provided', async () => {
      const newFileName = 'ab c d ';

      catsRepository.updateCatImage = jest.fn().mockResolvedValue({
        ...mockCatImage,
        fileName: 'abcd',
        owner: mockImageOwner,
      });

      await expect(
        catsService.updateCatImage(mockCatImageId, mockFile, mockImageOwner, {
          fileName: newFileName,
        }),
      ).resolves.toEqual({
        ...mockCatImageInfo,
        fileName: 'abcd',
        owner: mockImageOwner,
      });
    });

    it('should update file when only new file name is provided', async () => {
      const newFileName = 'ab c d ';

      catsRepository.updateCatImage = jest.fn().mockResolvedValue({
        ...mockCatImage,
        fileName: 'abcd',
        owner: mockImageOwner,
      });

      await expect(
        catsService.updateCatImage(mockCatImageId, null, mockImageOwner, {
          fileName: newFileName,
        }),
      ).resolves.toEqual({
        ...mockCatImageInfo,
        fileName: 'abcd',
        owner: mockImageOwner,
      });
    });
  });

  describe('Get cat image by id', () => {
    it('should return cat image created by logged-in user', async () => {
      catsRepository.findCatImage = jest.fn().mockResolvedValue({
        ...mockCatImage,
        owner: {
          id: mockImageOwner,
          fullname: 'derek',
        },
      });

      await expect(
        catsService.getCatImage(mockCatImageId, mockImageOwner),
      ).resolves.toEqual(mockCatImageInfo);
    });
  });

  describe('Get cat images', () => {
    it('should return list of paginated results of cat images', async () => {
      const pagination = {
        limit: '10',
        page: '1',
      };
      await expect(
        catsService.getCatImages(pagination, mockImageOwner),
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
    it('should soft delete selected cat image', async () => {
      await expect(
        catsService.removeCatImage(mockCatImageId, mockImageOwner),
      ).resolves.toBe(SUCCESS.CATS.REMOVED);
    });
  });
});
