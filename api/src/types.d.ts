import type { Static } from "@sinclair/typebox";
import type { cardSchema, userSchema } from "./db/schema";

export type User = Static<typeof userSchema>;
export type Card = Static<typeof cardSchema>;

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

export interface GetApiRoutes {
  "/user/:id": {
    Params: { id: number };
    Reply: User;
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
    Body: Card;
    Reply: User;
  };
}

export interface DeleteApiRoutes {
  "/user/:id/collection/:card_id": {
    Params: { id: number; card_id: string };
    Reply: User;
  };
}
