import { errorResponseSpec } from './error-response-spec';

export const errorResponse = (error: errorResponseSpec) => ({
  status: 'Fail',
  statusCode: error.statusCode,
  error: error.message?.length > 0 ? error.message : error.error,
});
