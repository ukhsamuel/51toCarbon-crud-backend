import { UserRoleEnum } from '../enums/roles.enum';

export interface User {
  id?: any;
  email: string;
  username: string;
  role: UserRoleEnum;
}
