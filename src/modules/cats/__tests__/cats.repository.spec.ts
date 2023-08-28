import { TestingModule, Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CatsRepository } from '../cats.repository';
import { CatDocument, Cat } from '../schemas/cats.schema';
import { mockCatImage, mockCatImageId, mockImageOwner } from './mockData';
import { IImageMetadata } from '../interfaces';

describe('CatsRepository', () => {
  let catsRepository: CatsRepository;
  let catModel: Model<CatDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        CatsRepository,
        {
          provide: getModelToken(Cat.name),
          useValue: {
            findOne: jest.fn().mockImplementation(() => ({
              populate: jest.fn().mockImplementation(() => ({
                lean: jest.fn().mockResolvedValue(mockCatImage),
              })),
            })),
            countDocuments: jest.fn().mockResolvedValue(1),
            find: jest.fn().mockImplementation(() => ({
              populate: jest.fn().mockImplementation(() => ({
                limit: jest.fn().mockImplementation(() => ({
                  skip: jest.fn().mockImplementation(() => ({
                    sort: jest.fn().mockImplementation(() => ({
                      lean: jest.fn().mockResolvedValue([mockCatImage]),
                    })),
                  })),
                })),
              })),
            })),
            create: jest.fn().mockResolvedValue(mockCatImage),
            findByIdAndUpdate: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
      exports: [],
    }).compile();

    catsRepository = module.get<CatsRepository>(CatsRepository);
    catModel = module.get<Model<CatDocument>>(getModelToken(Cat.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('Should be defined', () => {
    expect(catsRepository).toBeDefined();
  });

  describe('Find cat image by name', () => {
    it('should return cat image using file name', async () => {
      const fileName = 'example8.png';
      catModel.findOne = jest.fn().mockImplementation(() => ({
        lean: jest.fn().mockResolvedValue(mockCatImage),
      }));
      await expect(
        catsRepository.findCatImageByName(fileName, mockImageOwner),
      ).resolves.toEqual(mockCatImage);
    });
  });

  describe('Find cat image by id', () => {
    it('should return cat image using image id', async () => {
      await expect(
        catsRepository.findCatImage(mockCatImageId, mockImageOwner),
      ).resolves.toEqual(mockCatImage);
    });
  });

  describe('Count of cat images', () => {
    it('should return total count of cat images', async () => {
      await expect(
        catsRepository.catImageCount(mockImageOwner),
      ).resolves.toEqual(1);
    });
  });

  describe('Find all cat images', () => {
    it('should return list of cat images by pagination', async () => {
      await expect(
        catsRepository.findCatImages(10, 1, mockImageOwner),
      ).resolves.toEqual([mockCatImage]);
    });
  });

  describe('Upload cat image', () => {
    it('should create a new cat document object', async () => {
      const dto: IImageMetadata = {
        fileName: 'example8.png',
        mimeType: 'image/png',
        metadata: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAABoMAAAPTCAMAAABMkIB9AAAC91BMVEX',
        ),
        fileSize: 45319,
        owner: '64eb36f92286f61093eb3482',
      };
      await expect(catsRepository.uploadCatImage(dto)).resolves.toEqual(
        mockCatImage,
      );
    });
  });

  describe('Update cat image', () => {
    it('should update file name for cat image', async () => {
      const dto: IImageMetadata = {
        fileName: 'example8.png',
        mimeType: 'image/png',
        metadata: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAABoMAAAPTCAMAAABMkIB9AAAC91BMVEX',
        ),
        fileSize: 45319,
        owner: '64eb36f92286f61093eb3482',
      };
      catModel.findByIdAndUpdate = jest
        .fn()
        .mockImplementationOnce(() => mockCatImage);
      await expect(
        catsRepository.updateCatImage(mockCatImageId, dto),
      ).resolves.toEqual(mockCatImage);
    });
  });

  describe('Remove cat image', () => {
    it('should soft delete existing cat image', async () => {
      await expect(
        catsRepository.softDeleteCatImage(mockCatImageId),
      ).resolves.toEqual(undefined);
    });
  });
});
