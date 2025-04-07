import { and, asc, desc, eq, inArray } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { db } from "../db";
import { cardsTable, usersTable } from "../db/table";
import type {
  CollectionCard,
  DeleteApiRoutes,
  GetApiRoutes,
  PutApiRoutes,
  User,
} from "../types";
import { queryBuilder } from "./utils/buildQuery";

export async function collectionRoutes(fastify: FastifyInstance) {
  fastify.get<GetApiRoutes["/user/:id/collection"]>(
    "/user/:id/collection",
    async (request, reply) => {
      const { id } = request.params;
      const query =
        request.query as GetApiRoutes["/user/:id/collection"]["Query"];

      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));

      if (!user) {
        return reply.status(404).send();
      }

      const collection = user.collection as User["collection"];

      const cardIds = collection.map((item) => item.card_id);

      const quantityMap = collection.reduce<{ [key: string]: number }>(
        (acc, item) => {
          acc[item.card_id] = item.quantity;
          return acc;
        },
        {},
      );

      const where = [
        inArray(cardsTable.card_id, cardIds),
        ...queryBuilder(query),
      ];

      const cards = await db
        .select()
        .from(cardsTable)
        .where(and(...where))
        .orderBy(
          query.order === "desc"
            ? desc(cardsTable.card_id)
            : asc(cardsTable.card_id),
        )
        .limit(Number(query.limit ?? 50))
        .offset(Number(query.offset ?? 0));

      const result = cards.map((card) => {
        return {
          ...card,
          quantity: quantityMap[card.card_id] || 0,
        };
      });

      return reply.send({
        count: collection.length,
        results: result as CollectionCard[],
      });
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

      const collection = user.collection as User["collection"];
      const cardIndex = collection.findIndex(
        (item) => item.card_id === card.card_id,
      );
      if (cardIndex !== -1) {
        collection[cardIndex].quantity += 1;
      } else {
        collection.push({ card_id: card.card_id, quantity: 1 });
      }

      await db
        .update(usersTable)
        .set({
          collection: collection,
        })
        .where(eq(usersTable.id, id));

      if (!user) {
        return reply.status(404).send();
      }

      const cardIds = collection.map((item) => item.card_id);

      const quantityMap = collection.reduce<{ [key: string]: number }>(
        (acc, item) => {
          acc[item.card_id] = item.quantity;
          return acc;
        },
        {},
      );

      const userCollectionWithDetails = await db
        .select()
        .from(cardsTable)
        .where(inArray(cardsTable.card_id, cardIds))
        .orderBy(asc(cardsTable.card_id))
        .limit(50)
        .offset(0);

      const result = userCollectionWithDetails.map((card) => {
        return {
          ...card,
          quantity: quantityMap[card.card_id] || 0,
        };
      });

      return reply.send(result as CollectionCard[]);
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

      const collection = user.collection as CollectionCard[];
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

      await db
        .update(usersTable)
        .set({ collection: JSON.stringify(collection) })
        .where(eq(usersTable.id, id));

      if (!user) {
        return reply.status(404).send();
      }

      const cardIds = collection.map((item) => item.card_id);

      const quantityMap = collection.reduce<{ [key: string]: number }>(
        (acc, item) => {
          acc[item.card_id] = item.quantity;
          return acc;
        },
        {},
      );

      const userCollectionWithDetails = await db
        .select()
        .from(cardsTable)
        .where(inArray(cardsTable.card_id, cardIds))
        .orderBy(asc(cardsTable.card_id))
        .limit(50)
        .offset(0);

      const result = userCollectionWithDetails.map((card) => {
        return {
          ...card,
          quantity: quantityMap[card.card_id] || 0,
        };
      });

      return reply.send(result as CollectionCard[]);
    },
  );
}
