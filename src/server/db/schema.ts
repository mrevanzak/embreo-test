import { relations, sql } from 'drizzle-orm';
import {
  date,
  pgEnum,
  pgTableCreator,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { type z } from 'zod';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `embreo-test_${name}`);

/*
 * User Schema
 *
 */
const roleEnum = pgEnum('embreo-test_role', ['vendor_admin', 'company_hr']);
export const users = createTable('user', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: text('password').notNull(),
  role: roleEnum('role').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),

  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id),
});
export const userRelation = relations(users, ({ one }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
}));
const user = createSelectSchema(users);
export type User = Omit<z.infer<typeof user>, 'password'>;

/*
 * Event Schema
 *
 */
export const events = createTable('event', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),

  handledBy: uuid('handled_by').references(() => companies.id),
});
export const insertEventSchema = createInsertSchema(events);
export const selectEventSchema = createSelectSchema(events);
export type Event = z.infer<typeof selectEventSchema>;

/*
 * Company Schema
 *
 */
export const companies = createTable('company', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});
export const companyRelation = relations(companies, ({ many }) => ({
  users: many(users),
}));

/*
 * EventProposal Schema
 *
 */
const statusEnum = pgEnum('embreo-test_status', [
  'pending',
  'approved',
  'rejected',
]);
export const eventProposals = createTable('event_proposal', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  date: date('date', { mode: 'date' }).notNull(),
  date1: date('date1', { mode: 'date' }),
  date2: date('date2', { mode: 'date' }),
  approvedDate: date('approved_date', { mode: 'date' }),
  location: varchar('location', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  status: statusEnum('status').notNull().default('pending'),
  remarks: varchar('remarks', { length: 255 }),

  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id),
  proposedBy: uuid('proposed_by')
    .notNull()
    .references(() => companies.id),
});
export const selectEventProposalSchema = createSelectSchema(eventProposals);
export const insertEventProposalSchema = createInsertSchema(eventProposals);
export type EventProposal = z.infer<typeof selectEventProposalSchema>;
