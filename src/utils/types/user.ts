import { ObjectId } from 'typeorm';
import { UserRoleEnum } from '../enums/roles.enum';

export interface User {
  id?: ObjectId;
  email: string;
  username: string;
  role: UserRoleEnum;
}
