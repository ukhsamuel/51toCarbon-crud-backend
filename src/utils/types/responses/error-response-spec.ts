import { ApiProperty } from '@nestjs/swagger';

export class errorResponseSpec {
  @ApiProperty()
  message?: Array<string>;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  error: string;
}
