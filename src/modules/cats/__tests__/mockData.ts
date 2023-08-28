import { UserRole } from '@modules/users/enums/user.role';
import { Readable } from 'stream';

export const mockCatImageId = '64eb374d2286f61093eb348d';

export const mockImageOwner = '64eb36f92286f61093eb3482';

export const mockCatImage = {
  _id: '64eb374d2286f61093eb348d',
  fileName: 'example8.png',
  mimeType: 'image/png',
  metadata: 'iVBORw0KGgoAAAANSUhEUgAABoMAAAPTCAMAAABMkIB9AAAC91BMVEX',
  fileSize: 45319,
  owner: '64eb36f92286f61093eb3482',
  isDeleted: false,
  createdAt: '2023-08-27T11:45:17.905+00:00',
  updatedAt: '2023-08-27T11:56:26.729+00:00',
};

export const mockCatImageInfo = {
  id: '64eb374d2286f61093eb348d',
  fileName: 'example8.png',
  mimeType: 'image/png',
  owner: 'derek',
  lastUpdated: '2023-08-27T11:56:26.729+00:00',
};

export const mockFile = {
  fieldname: '',
  originalname: 'example8.png',
  encoding: 'utf-8',
  mimetype: 'image/png',
  size: 45319,
  stream: new Readable({ encoding: 'utf-8', read: () => null }),
  destination: '',
  filename: '',
  path: '',
  buffer: Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAABoMAAAPTCAMAAABMkIB9AAAC91BMVEX',
  ),
};

export const mockLoggedInUser = {
  id: '64eb36f92286f61093eb3482',
  fullname: 'anto',
  email: 'antismyname@gmail.com',
  role: UserRole.user,
};
