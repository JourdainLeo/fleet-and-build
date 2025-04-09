import {
  Type as CardType,
  Class,
  Format,
  Hero,
  Rarity,
  Release,
  Subtype,
} from "@flesh-and-blood/types";
import { Type } from "@sinclair/typebox";
import { createSelectSchema } from "drizzle-typebox";
import { cardsTable, usersTable } from "./table";
export const UserCollectionSchema = Type.Array(
  Type.Object({
    card_id: Type.String(),
    quantity: Type.Integer(),
  }),
);

export const CardImageSchema = Type.Object({
  large: Type.String(),
  normal: Type.String(),
  small: Type.String(),
});

export const CardOtherSchema = Type.Object({
  back_face: Type.Union([Type.String(), Type.Null()]),
  card_type: Type.String(),
  display_name: Type.String(),
  intellect: Type.String(),
  object_type: Type.String(),
  text: Type.String(),
  text_html: Type.String(),
  url: Type.String(),
  typebox: Type.String(),
});

export const DeckTableSchema = Type.Object({
  id: Type.Integer(),
  name: Type.String(),
  hero: Type.String(),
  type: Type.String(),
  image: Type.String(),
  cards: UserCollectionSchema,
});

export const userSchema = createSelectSchema(usersTable, {
  collection: UserCollectionSchema,
  decks: Type.Array(DeckTableSchema),
});

export const cardSchema = createSelectSchema(cardsTable, {
  other: CardOtherSchema,
  image: CardImageSchema,
});

export const collectionCardSchema = Type.Object({
  ...cardSchema.properties,
  quantity: Type.Integer(),
  rarities: Type.Array(Type.Enum(Rarity)),
  classes: Type.Array(Type.Enum(Class)),
  sets: Type.Array(Type.Enum(Release)),
  type: Type.Array(Type.Enum(CardType)),
  subtype: Type.Array(Type.Enum(Subtype)),
  legalHeroes: Type.Array(Type.Enum(Hero)),
  legalFormats: Type.Array(Type.Enum(Format)),
});

export const DeckApiSchema = Type.Object({
  id: Type.Integer(),
  name: Type.String(),
  hero: Type.String(),
  image: Type.String(),
  type: Type.String(),
  cards: Type.Array(collectionCardSchema),
});
