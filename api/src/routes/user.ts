// backend/src/users.ts

import type {
  GetApiRoutes,
  PostApiRoutes,
  PutApiRoutes,
  User,
} from "@fleet-and-build/api";
import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { db } from "../db";
import { usersTable } from "../db/table";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get<GetApiRoutes["/user/:id"]>(
    "/user/:id",
    async (request, reply) => {
      const { id } = request.params;

      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));

      if (!user) {
        return reply.status(404).send();
      }

      return reply.send(user[0] as User);
    },
  );

  fastify.post<PostApiRoutes["/user"]>("/user", async (request, reply) => {
    const user = request.body;

    const [newUser] = await db
      .insert(usersTable)
      .values({
        name: user.name,
        email: user.email,
        collection: JSON.stringify([]),
        decks: JSON.stringify([]),
      })
      .returning();

    return reply.status(201).send({ success: true, user: newUser as User });
  });

  fastify.put<PutApiRoutes["/user/:id"]>(
    "/user/:id",
    async (request, reply) => {
      const { id } = request.params;
      const userData = request.body;

      if (!userData || Object.keys(userData).length === 0) {
        return reply.status(400).send();
      }

      const [user] = await db
        .update(usersTable)
        .set(userData)
        .where(eq(usersTable.id, id))
        .returning();

      if (!user) {
        return reply.status(404).send();
      }

      return reply.send(user as User);
    },
  );
}
