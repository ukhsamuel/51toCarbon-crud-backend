import { BaseUser } from '../user/base-user.dto';

export class SignupDto extends BaseUser {
  createdAt?: Date;
}
