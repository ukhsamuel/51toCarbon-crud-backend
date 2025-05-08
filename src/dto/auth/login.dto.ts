import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail(
    {},
    {
      message: 'Invalid Email',
    },
  )
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
