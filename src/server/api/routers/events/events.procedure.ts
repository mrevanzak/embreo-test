import { eq } from 'drizzle-orm';

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/server/api/trpc';
import {
  events,
  insertEventSchema,
  selectEventSchema,
} from '@/server/db/schema';

export const eventsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.events.findMany({
      where: (event, { eq }) =>
        eq(event.handledBy, ctx.session.user.companyId).if(
          ctx.session.user.role === 'vendor_admin',
        ),
    });
  }),

  create: adminProcedure
    .input(insertEventSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(events)
        .values({ ...input, handledBy: ctx.session.user.companyId });
    }),

  delete: adminProcedure
    .input(selectEventSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(events).where(eq(events.id, input.id));
    }),
});
