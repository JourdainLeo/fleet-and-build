import { integer, jsonb, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  collection: jsonb("collection").notNull(),
});

export const cardsTable = pgTable("cards", {
  card_id: varchar("card_id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  image: jsonb("image").notNull(),
  sets: varchar("sets", { length: 255 }).array().notNull(),
  artists: varchar("artists", { length: 255 }).array().notNull(),
  rarities: varchar("rarities", { length: 255 }).array().notNull(),
  classes: varchar("classes", { length: 255 }).array().notNull(),
  types: varchar("types", { length: 255 }).array().notNull(),
  subtypes: varchar("subtypes", { length: 255 }).array().notNull(),
  legalHeroes: varchar("legalHeroes", { length: 255 }).array().notNull(),
  legalFormats: varchar("legalFormats", { length: 255 }).array().notNull(),
  pitch: integer("pitch"),
  power: integer("power"),
  life: integer("life"),
  defense: integer("defense"),
  cost: integer("cost"),
  other: jsonb("full_data").notNull(),
});
