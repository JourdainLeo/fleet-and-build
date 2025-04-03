import type { User } from "@fleet-and-build/types";

export interface UserPostRequest {
  name: string;
  email: string;
}

export interface PostApiRoutes {
  "/user": {
    POST: {
      Body: UserPostRequest;
      Reply: {
        success: boolean;
        user: User;
      };
    };
  };
}

export interface GetApiRoutes {
  "/user/:id": {
    GET: {
      Params: { id: number };
      Reply: User;
    };
  };
}
