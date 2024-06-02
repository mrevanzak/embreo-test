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

import { eventFilterSchema } from './events.input';

export const eventsRouter = createTRPCRouter({
  get: protectedProcedure
    .input(eventFilterSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.events.findMany({
        where: (event, { eq, and, isNull }) =>
          and(
            eq(event.handledBy, ctx.session.user.companyId).if(
              ctx.session.user.role === 'vendor_admin',
            ),
            isNull(event.deletedAt).if(!input?.withSoftDeleted),
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
      return await ctx.db
        .update(events)
        .set({
          deletedAt: new Date(),
        })
        .where(eq(events.id, input.id));
    }),
});
