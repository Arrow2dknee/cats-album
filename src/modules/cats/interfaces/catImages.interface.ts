import { ICatImage } from './catImage.interface';

export interface ICatImages {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  cats: ICatImage[];
}
