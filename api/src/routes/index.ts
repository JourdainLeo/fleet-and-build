// backend/src/users.ts

import type {
  Card,
  DeleteApiRoutes,
  GetApiRoutes,
  PostApiRoutes,
  PutApiRoutes,
  User,
} from "@fleet-and-build/api";
import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { db } from "../db";
import { usersTable } from "../db/schema";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post<PostApiRoutes["/user"]>("/user", async (request, reply) => {
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
  });

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

  fastify.put<PutApiRoutes["/user/:id/collection"]>(
    "/user/:id/collection",
    async (request, reply) => {
      const { id } = request.params;
      const card = request.body;

      if (!card || Object.keys(card).length === 0) {
        return reply.status(400).send();
      }

      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));

      const collection = user.collection as Card[];
      const cardIndex = collection.findIndex(
        (item) => item.card_id === card.card_id,
      );
      if (cardIndex !== -1) {
        collection[cardIndex].quantity += 1;
      } else {
        collection.push({ ...card, quantity: 1 });
      }

      const [updated] = await db
        .update(usersTable)
        .set({
          collection: JSON.stringify(
            collection.sort((a, b) => a.card_id.localeCompare(b.card_id)),
          ),
        })
        .where(eq(usersTable.id, id))
        .returning();

      if (!user) {
        return reply.status(404).send();
      }

      return reply.send(updated as User);
    },
  );

  fastify.get<GetApiRoutes["/user/:id/collection"]>(
    "/user/:id/collection",
    async (request, reply) => {
      const { id } = request.params;
      const {
        limit = 50,
        offset = 0,
        q = "",
      } = request.query as GetApiRoutes["/user/:id/collection"]["Query"];

      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));

      if (!user) {
        return reply.status(404).send();
      }

      const collection = user.collection as Card[];

      const filteredCollection = collection.filter((card) =>
        card.card_id.includes(q.toLowerCase()),
      );

      const paginatedCollection = filteredCollection.slice(
        offset,
        offset + limit,
      );

      return reply.send({
        count: collection.length,
        results: paginatedCollection,
      });
    },
  );

  fastify.delete<DeleteApiRoutes["/user/:id/collection/:card_id"]>(
    "/user/:id/collection/:card_id",
    async (request, reply) => {
      const { id, card_id } = request.params;

      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));

      const collection = user.collection as Card[];
      const cardIndex = collection.findIndex(
        (item) => item.card_id === card_id,
      );

      if (cardIndex !== -1) {
        collection[cardIndex].quantity -= 1;
        if (collection[cardIndex].quantity === 0) {
          collection.splice(cardIndex, 1);
        }
      } else {
        return reply.status(404).send();
      }

      const [updated] = await db
        .update(usersTable)
        .set({ collection: JSON.stringify(collection) })
        .where(eq(usersTable.id, id))
        .returning();

      if (!user) {
        return reply.status(404).send();
      }

      return reply.send(updated as User);
    },
  );
}
