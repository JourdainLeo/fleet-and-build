import type { Static } from "@sinclair/typebox";
import type {
  cardSchema,
  collectionCardSchema,
  DeckApiSchema,
  DeckTableSchema,
  userSchema,
} from "./db/schema";

export type User = Static<typeof userSchema>;
export type Card = Static<typeof cardSchema>;
export type CollectionCard = Static<typeof collectionCardSchema>;
export type DeckTable = Static<typeof DeckTableSchema>;
export type DeckApi = Static<typeof DeckApiSchema>;

export interface PostApiRoutes {
  "/user": {
    Body: {
      name: string;
      email: string;
    };
    Reply: {
      success: boolean;
      user: User;
    };
    Params: { id: number };
  };
  "/user/:id/deck": {
    Params: { id: number };
    Reply: { count: number; results: DeckApi[] };
    Body: {
      name: string;
      type: "Blitz" | "Classic Constructed";
      hero: string;
    };
    Query: null;
  };
}

export interface FilterQuery {
  limit?: number;
  offset?: number;
  q?: string;
  pitch?: number;
  pitch_operator?: "=" | "<" | ">" | "<=" | ">=";
  order?: "asc" | "desc";
  defense?: number;
  defense_operator?: "=" | "<" | ">" | "<=" | ">=";
  attack?: number;
  attack_operator?: "=" | "<" | ">" | "<=" | ">=";
  cost?: number;
  cost_operator?: "=" | "<" | ">" | "<=" | ">=";
  hero?: string;
  set?: string;
  type?: string;
  rarity?: string;
  fusion?: string;
  artist?: string;
}

export interface GetApiRoutes {
  "/user/:id": {
    Params: { id: number };
    Reply: User;
    Query: null;
  };
  "/user/:id/collection": {
    Params: { id: number };
    Reply: { count: number; results: CollectionCard[] };
    Query: FilterQuery;
  };
  "/cards": {
    Params: {};
    Reply: { count: number; results: Card[] };
    Query: FilterQuery;
  };
  "/user/:id/decks": {
    Params: { id: number };
    Reply: { count: number; results: DeckApi[] };
    Query: null;
  };
  "/user/:id/deck/:deck_id": {
    Params: { id: number; deck_id: number };
    Reply: { count: number; results: DeckApi };
    Query: null;
  };
}

export interface PutApiRoutes {
  "/user/:id": {
    Params: { id: number };
    Body: { name: string; email: string };
    Reply: User;
  };
  "/user/:id/collection": {
    Params: { id: number };
    Body: { card_id: string };
    Reply: CollectionCard[];
  };
  "/user/:id/deck/:deck_id": {
    Params: { id: number; deck_id: number };
    Reply: { count: number; results: DeckApi[] };
    Body: DeckTable;
  };
}

export interface DeleteApiRoutes {
  "/user/:id/collection/:card_id": {
    Params: { id: number; card_id: string };
    Reply: CollectionCard[];
  };
  "/user/:id/deck/:deck_id": {
    Params: { id: number; deck_id: number };
    Reply: { count: number; results: DeckApi[] };
    Query: null;
  };
}
