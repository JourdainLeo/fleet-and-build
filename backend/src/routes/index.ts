// backend/src/users.ts

import type { GetApiRoutes, PostApiRoutes } from "@fleet-and-build/api";
import type { User } from "@fleet-and-build/types";
import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { db } from "../db";
import { usersTable } from "../db/schema";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post<PostApiRoutes["/user"]["POST"]>(
    "/user",
    async (request, reply) => {
      const user = request.body;

      const [newUser] = await db
        .insert(usersTable)
        .values({
          name: user.name,
          email: user.email,
          collection: JSON.stringify([]),
        })
        .returning();

      return reply.status(201).send({ success: true, user: newUser as User });
    },
  );

  fastify.get<GetApiRoutes["/user/:id"]["GET"]>(
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
}
