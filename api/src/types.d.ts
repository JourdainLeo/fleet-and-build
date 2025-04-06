import type { Static } from "@sinclair/typebox";
import type { cardSchema, collectionCardSchema, userSchema } from "./db/schema";

export type User = Static<typeof userSchema>;
export type Card = Static<typeof cardSchema>;
export type CollectionCard = Static<typeof collectionCardSchema>;

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
  };
}

export interface FilterQuery {
  limit?: number;
  offset?: number;
  q?: string;
  pitch?: number;
  pitch_operator?: string;
  order?: "asc" | "desc";
  defense?: number;
  defense_operator?: string;
  attack?: number;
  attack_operator?: string;
  cost?: number;
  cost_operator?: string;
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
}

export interface DeleteApiRoutes {
  "/user/:id/collection/:card_id": {
    Params: { id: number; card_id: string };
    Reply: CollectionCard[];
  };
}
