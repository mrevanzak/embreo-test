import { eq } from 'drizzle-orm';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import {
  eventProposals,
  insertEventProposalSchema,
  users,
} from '@/server/db/schema';

export const proposedEventsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const query = await ctx.db
      .select({ eventProposals })
      .from(eventProposals)
      .innerJoin(users, eq(eventProposals.proposedBy, users.id))
      .where(eq(users.companyId, ctx.session.user.companyId));

    return query.map((row) => row.eventProposals);
  }),

  create: protectedProcedure
    .input(insertEventProposalSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(eventProposals).values(input);
    }),
});
