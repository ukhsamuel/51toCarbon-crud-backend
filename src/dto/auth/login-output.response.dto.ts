import { getSchemaPath } from '@nestjs/swagger';
import { BaseUser } from '../user/base-user.dto';

export const LoginOutputDtoSchema = getSchemaPath(BaseUser);
