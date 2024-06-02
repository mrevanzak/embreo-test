import { eq } from 'drizzle-orm';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import {
  companies,
  eventProposals,
  insertEventProposalSchema,
  selectEventProposalSchema,
} from '@/server/db/schema';

export const proposedEventsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const query = await ctx.db
      .select()
      .from(eventProposals)
      .innerJoin(companies, eq(eventProposals.proposedBy, companies.id))
      .where(eq(companies.id, ctx.session.user.companyId));

    return query.map((row) => ({
      ...row.event_proposal,
      proposedByCompany: row.company.name,
    }));
  }),

  create: protectedProcedure
    .input(insertEventProposalSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(eventProposals).values(input);
    }),

  delete: protectedProcedure
    .input(selectEventProposalSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(eventProposals)
        .where(eq(eventProposals.id, input.id));
    }),
});
