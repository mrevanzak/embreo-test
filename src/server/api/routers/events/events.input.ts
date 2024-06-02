import { z } from 'zod';

export const eventFilterSchema = z
  .object({
    withSoftDeleted: z.boolean().optional(),
  })
  .optional();
