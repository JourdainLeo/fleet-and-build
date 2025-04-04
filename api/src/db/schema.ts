import { Type } from "@sinclair/typebox";
import { jsonb, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-typebox";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  collection: jsonb("collection").notNull(),
});

export const CardImageSchema = Type.Object({
  large: Type.String(),
  normal: Type.String(),
  small: Type.String(),
});

export const cardSchema = Type.Object({
  back_face: Type.Union([Type.String(), Type.Null()]),
  card_id: Type.String(),
  card_type: Type.String(),
  cost: Type.String(),
  defense: Type.String(),
  display_name: Type.String(),
  image: CardImageSchema,
  intellect: Type.String(),
  life: Type.String(),
  name: Type.String(),
  object_type: Type.String(),
  pitch: Type.String(),
  power: Type.String(),
  text: Type.String(),
  text_html: Type.String(),
  typebox: Type.String(),
  url: Type.String(),
  quantity: Type.Number(),
  artists: Type.Array(Type.String()),
  classes: Type.Array(Type.String()),
  sets: Type.Array(Type.String()),
  rarities: Type.Array(Type.String()),
  types: Type.Array(Type.String()),
  subtypes: Type.Array(Type.String()),
  legalHeroes: Type.Array(Type.String()),
  legalFormats: Type.Array(Type.String()),
});

export const userSchema = createSelectSchema(usersTable, {
  collection: Type.Array(cardSchema),
});
