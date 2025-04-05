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

export const userSchema = createSelectSchema(usersTable, {
  collection: UserCollectionSchema,
});

export const cardSchema = createSelectSchema(cardsTable, {
  other: CardOtherSchema,
  image: CardImageSchema,
});

export const collectionCardSchema = Type.Object({
  ...cardSchema.properties,
  quantity: Type.Integer(),
});
