import type { ApiRoutes } from "@fleet-and-build/api";
import type { FastifyInstance } from "fastify";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post<ApiRoutes["/users"]["POST"]>(
    "/users",
    async (request, reply) => {
      const user = request.body;
      return { success: true, user };
    },
  );

  fastify.get<ApiRoutes["/users"]["GET"]>("/users", async (request, reply) => {
    return {
      users: [{ id: "1", name: "John Doe", email: "john@example.com" }],
    };
  });
}
