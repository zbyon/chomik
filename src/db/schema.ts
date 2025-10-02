/*
 * Copyright (C) 2025 Piecuuu

 * This file is part of Chomik.
 * Chomik is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * Chomik is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with Chomik. If not, see <https://www.gnu.org/licenses/>. 
 */

import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { UniqueID } from "../uid";

export const xpTable = pgTable("xp", {
  user: varchar({ length: 32 }).notNull().primaryKey(),
  guild: varchar({ length: 32 }).notNull(),
  xp: integer().notNull().default(0),
  lvl: integer().notNull().default(0),
});

export const infractionTable = pgTable("infractions", {
  id: varchar({ length: 32 }).notNull().primaryKey().unique(),
  type: integer().notNull(),
  target: varchar({ length: 32 }).notNull(),
  author: varchar({ length: 32 }).notNull(),
  guild: varchar({ length: 32 }).notNull(),
  reason: text(),
  punishmentTime: integer(), // in seconds
  time: timestamp().notNull().defaultNow(),
  context: varchar({ length: 32 }), // message id
})

export const guildsTable = pgTable("guilds", {
  guild: varchar({ length: 32 }).notNull().primaryKey().unique(),
  alertChannel: varchar({ length: 32 }),
  publicAlertChannel: varchar({ length: 32 }),
  moderatorRoles: varchar({ length: 32 }).array().notNull().default(sql`'{}'::text[]`),
  reportChannel: varchar({ length: 32 }),
})

export const reportTable = pgTable("reports", {
  id: varchar({ length: 32 }).notNull().primaryKey().unique().$default(() => new UniqueID().id),
  target: varchar({ length: 32 }).notNull(),
  author: varchar({ length: 32 }).notNull(),
  guild: varchar({ length: 32 }).notNull(),
  reason: text(),
  time: timestamp().notNull().defaultNow(),
  status: integer().notNull().default(0), // default is open
  context: varchar({ length: 32 }).references(() => reportContextTable.message),
})

export const reportContextTable = pgTable("reportContexts", {
  message: varchar({ length: 32 }), // message id
  archive: varchar({ length: 32 }).array().references(() => messageArchiveTable.id).notNull().default(sql`'{}'::text[]`),
  channel: varchar({ length: 32 }),
})

export const messageArchiveTable = pgTable("messageArchive", {
  id: varchar({ length: 32 }).notNull().primaryKey().unique(),
  author: varchar({ length: 32 }).notNull(),
  guild: varchar({ length: 32 }).notNull(),
  created: timestamp().notNull(),

  content: varchar({ length: 4000 }),
  imageAttachmentID: varchar({ length: 64 }),
})