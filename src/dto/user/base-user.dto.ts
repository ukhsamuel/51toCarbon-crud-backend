import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsUserEmailAlreadyExist } from '../../users/validations/is-user-email-already-exist.decorator';
import { IsUsernameAlreadyExist } from '../../users/validations/is-username-already-exist.decorator';
import { IsValidRole } from '../../users/validations/is-valid-role.decorator';
import { Match } from '../../users/validations/match.decorator';
import { UserRoleEnum } from '../../utils/enums/roles.enum';

export class BaseUser {
  @ApiProperty()
  id?: string;

  @ApiProperty({ example: 'test123' })
  @IsString()
  @IsNotEmpty()
  @IsUsernameAlreadyExist()
  username: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail(
    {},
    {
      message: 'Invalid email',
    },
  )
  @IsNotEmpty()
  @IsUserEmailAlreadyExist()
  email: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @IsValidRole({ message: 'Invalid user role' })
  @ApiProperty({ example: UserRoleEnum.CUSTOMER })
  role?: UserRoleEnum;
}
