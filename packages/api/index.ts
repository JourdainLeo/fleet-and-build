export interface ApiRoutes {
  "/users": {
    POST: {
      Body: { id: string; name: string; email: string };
      Reply: {
        success: boolean;
        user: { id: string; name: string; email: string };
      };
    };
    GET: {
      Querystring?: never;
      Params?: never;
      Body?: never;
      Reply: { users: { id: string; name: string; email: string }[] };
    };
  };
}
