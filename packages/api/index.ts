import type { Card, User } from "@fleet-and-build/types";

export interface UserPostRequest {
  name: string;
  email: string;
}

export interface PostApiRoutes {
  "/user": {
    Body: UserPostRequest;
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
