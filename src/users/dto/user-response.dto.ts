import { getSchemaPath } from '@nestjs/swagger';
import { User } from '../../utils/types/user';

export class UsersOutputDto {
  id: string;
  username: string;
  email: string;
  created_at: Date;
  deleted_at: Date;
  updated_at: Date;

  static FromUserOutput(user: User) {
    const output = new UsersOutputDto();

    const exposedKeys = ['id', 'username', 'email', 'role'];

    exposedKeys.forEach((exposedKey) => {
      output[exposedKey] = user[exposedKey];
    });

    return output;
  }
}

export const UsersOutputDtoSchema = getSchemaPath(UsersOutputDto);
