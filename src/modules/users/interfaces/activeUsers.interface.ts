import { UserDocument } from '../schemas/users.schema';

export interface IActiveUsers {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  users: UserDocument[];
}
