import { ApiProperty } from '@nestjs/swagger';
import { objectResponse } from './object-response';

export class successResponseSpec {
  @ApiProperty()
  status: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  data: Array<objectResponse> | objectResponse | null;
}
