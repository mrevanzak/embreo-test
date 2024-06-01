import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { users } from '@/server/db/schema';

export const authSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
}).pick({
  email: true,
  password: true,
});
