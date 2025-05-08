import { User } from '../user';

export interface RequestWithUser extends Request {
  user: User;
}
