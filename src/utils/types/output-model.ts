import { getSchemaPath } from '@nestjs/swagger';

import { successResponseSpec } from './responses/success-response-spec';

export const ResponseSchemaHelper = (
  schemaPath: string,
  type: 'object' | 'array' = 'object',
) => ({
  allOf: [
    { $ref: getSchemaPath(successResponseSpec) },
    {
      properties: {
        data: {
          ...(type === 'object'
            ? { allOf: [{ $ref: schemaPath }] }
            : { type, items: { $ref: schemaPath } }),
        },
      },
    },
  ],
});
