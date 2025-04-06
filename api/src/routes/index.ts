// backend/src/users.ts

import type {
  Card,
  CollectionCard,
  DeleteApiRoutes,
  GetApiRoutes,
  PostApiRoutes,
  PutApiRoutes,
  User,
} from "@fleet-and-build/api";
import {
  and,
  arrayOverlaps,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  lt,
  lte,
} from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { db } from "../db";
import { cardsTable, usersTable } from "../db/table";

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

  fastify.get<GetApiRoutes["/cards"]>("/cards", async (request, reply) => {
    const query = request.query as GetApiRoutes["/cards"]["Query"];

    const where = [];

    if (query.q) {
      where.push(ilike(cardsTable.card_id, `%${query.q}%`));
    }

    if (query.pitch) {
      if (query.pitch_operator === "=") {
        where.push(eq(cardsTable.pitch, query.pitch));
      }
      if (query.pitch_operator === ">") {
        where.push(gt(cardsTable.pitch, query.pitch));
      }
      if (query.pitch_operator === "<") {
        where.push(lt(cardsTable.pitch, query.pitch));
      }
      if (query.pitch_operator === ">=") {
        where.push(gte(cardsTable.pitch, query.pitch));
      }
      if (query.pitch_operator === "<=") {
        where.push(lte(cardsTable.pitch, query.pitch));
      }
    }

    if (query.attack) {
      if (query.attack_operator === "=") {
        where.push(eq(cardsTable.power, query.attack));
      }
      if (query.attack_operator === ">") {
        where.push(gt(cardsTable.power, query.attack));
      }
      if (query.attack_operator === "<") {
        where.push(lt(cardsTable.power, query.attack));
      }
      if (query.attack_operator === ">=") {
        where.push(gte(cardsTable.power, query.attack));
      }
      if (query.attack_operator === "<=") {
        where.push(lte(cardsTable.power, query.attack));
      }
    }

    if (query.defense) {
      if (query.defense_operator === "=") {
        where.push(eq(cardsTable.defense, query.defense));
      }
      if (query.defense_operator === ">") {
        where.push(gt(cardsTable.defense, query.defense));
      }
      if (query.defense_operator === "<") {
        where.push(lt(cardsTable.defense, query.defense));
      }
      if (query.defense_operator === ">=") {
        where.push(gte(cardsTable.defense, query.defense));
      }
      if (query.defense_operator === "<=") {
        where.push(lte(cardsTable.defense, query.defense));
      }
    }

    if (query.cost) {
      if (query.cost_operator === "=") {
        where.push(eq(cardsTable.cost, query.cost));
      }
      if (query.cost_operator === ">") {
        where.push(gt(cardsTable.cost, query.cost));
      }
      if (query.cost_operator === "<") {
        where.push(lt(cardsTable.cost, query.cost));
      }
      if (query.cost_operator === ">=") {
        where.push(gte(cardsTable.cost, query.cost));
      }
      if (query.cost_operator === "<=") {
        where.push(lte(cardsTable.cost, query.cost));
      }
    }

    if (query.hero) {
      where.push(arrayOverlaps(cardsTable.legalHeroes, [query.hero]));
    }

    if (query.set) {
      where.push(arrayOverlaps(cardsTable.sets, [query.set]));
    }

    if (query.type) {
      where.push(arrayOverlaps(cardsTable.types, [query.type]));
    }

    if (query.rarity) {
      where.push(arrayOverlaps(cardsTable.rarities, [query.rarity]));
    }

    if (query.fusion) {
      where.push(arrayOverlaps(cardsTable.classes, [query.fusion]));
    }

    if (query.artist) {
      where.push(arrayOverlaps(cardsTable.artists, [query.artist]));
    }

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

    console.log(JSON.stringify(query));
    console.log(cards.length);

    if (!cards) {
      return reply.status(404).send();
    }

    const total = await db.select({ count: count() }).from(cardsTable);

    return reply.send({
      count: total[0].count,
      results: cards as Card[],
    });
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

      const collection = user.collection as User["collection"];

      const cardIds = collection.map((item) => item.card_id);

      const quantityMap = collection.reduce<{ [key: string]: number }>(
        (acc, item) => {
          acc[item.card_id] = item.quantity;
          return acc;
        },
        {},
      );

      const where = [inArray(cardsTable.card_id, cardIds)];

      if (q) {
        where.push(ilike(cardsTable.card_id, `%${q}%`));
      }

      const cards = await db
        .select()
        .from(cardsTable)
        .where(and(...where))
        .orderBy(asc(cardsTable.card_id))
        .limit(Number(limit))
        .offset(Number(offset));

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
