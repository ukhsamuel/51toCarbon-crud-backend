import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { IsValidRole } from '../../users/validations/is-valid-role.decorator';
import { UserRoleEnum } from '../../utils/enums/roles.enum';

export class UpdateUserDto {
  @ApiProperty({ example: 'test123' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsValidRole({ message: 'Invalid user role' })
  @ApiProperty({ example: UserRoleEnum.CUSTOMER })
  role?: UserRoleEnum;
}
