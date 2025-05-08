import { objectResponse } from './object-response';
import { successResponseSpec } from './success-response-spec';

export const successResponse = (
  message: string,
  statusCode = 200,
  data: Array<objectResponse> | objectResponse | null = null,
): successResponseSpec => ({
  status: 'Success',
  statusCode,
  message,
  ...(!(data == null) && { data }),
});
