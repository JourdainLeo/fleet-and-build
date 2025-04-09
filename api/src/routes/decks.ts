import { and, arrayOverlaps, eq, inArray } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { db } from "../db";
import { cardsTable, usersTable } from "../db/table";
import type {
  Card,
  CollectionCard,
  DeckApi,
  DeckTable,
  DeleteApiRoutes,
  GetApiRoutes,
  PostApiRoutes,
  User,
} from "../types";

export async function decksRoutes(fastify: FastifyInstance) {
  fastify.get<GetApiRoutes["/user/:id/decks"]>(
    "/user/:id/decks",
    async (request, reply) => {
      const { id } = request.params;

      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));

      if (!user) {
        return reply.status(404).send();
      }

      const decks = user.decks as User["decks"];
      const results: DeckApi[] = [];
      await Promise.all(
        decks.map(async (deck) => {
          if (!deck) {
            return reply.status(404).send();
          }

          const cardIds = deck.cards.map((item) => item.card_id);

          const quantityMap = deck.cards.reduce<{ [key: string]: number }>(
            (acc, item) => {
              acc[item.card_id] = item.quantity;
              return acc;
            },
            {},
          );

          const where = [inArray(cardsTable.card_id, cardIds)];

          const cards = await db
            .select()
            .from(cardsTable)
            .where(and(...where));

          const result = cards.map((card) => {
            return {
              ...card,
              quantity: quantityMap[card.card_id] || 0,
            };
          });
          results.push({ ...deck, cards: result as CollectionCard[] });

          console.log("current ", deck);
          console.log("res ", result);
          console.log("push ", { ...deck, cards: result as CollectionCard[] });
        }),
      );

      console.log("results ", results);
      return reply.send({
        count: results.length,
        results: results,
      });
    },
  );

  fastify.post<PostApiRoutes["/user/:id/deck"]>(
    "/user/:id/deck",
    async (request, reply) => {
      const { id } = request.params;
      const deck = request.body as DeckApi;
      deck.cards = [];
      deck.id = Math.floor(Math.random() * 1000000);
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));

      // get from card table hero where legalName contains deck.hero AND card.type contains "Hero"
      const card = (await db
        .select()
        .from(cardsTable)
        .where(
          and(
            arrayOverlaps(cardsTable.legalHeroes, [deck.hero]),
            eq(cardsTable.life, deck.type === "Blitz" ? 20 : 40),
          ),
        )) as unknown as Card[];

      if (!user) {
        return reply.status(404).send();
      }

      if (!card) {
        return reply.status(404).send();
      }
      deck.image = card[0].image.normal;

      const decks = user.decks as User["decks"];

      decks.push(deck);

      await db
        .update(usersTable)
        .set({ decks: JSON.stringify(decks) })
        .where(eq(usersTable.id, id));

      return reply.send({ count: decks.length, results: decks as DeckApi[] });
    },
  );

  fastify.put<GetApiRoutes["/user/:id/deck/:deck_id"]>(
    "/user/:id/deck/:deck_id",
    async (request, reply) => {
      const { id, deck_id } = request.params;
      const deck = request.body as DeckTable;
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));

      if (!user) {
        return reply.status(404).send();
      }

      const decks = user.decks as User["decks"];
      const deckIndex = decks.findIndex((deck) => deck.id === deck_id);
      if (deckIndex === -1) {
        return reply.status(404).send();
      }

      decks[deckIndex] = deck;

      await db
        .update(usersTable)
        .set({ decks: JSON.stringify(decks) })
        .where(eq(usersTable.id, id));

      const cardIds = deck.cards.map((item) => item.card_id);

      const quantityMap = deck.cards.reduce<{ [key: string]: number }>(
        (acc, item) => {
          acc[item.card_id] = item.quantity;
          return acc;
        },
        {},
      );

      const where = [inArray(cardsTable.card_id, cardIds)];

      const cards = await db
        .select()
        .from(cardsTable)
        .where(and(...where));

      const result = cards.map((card) => {
        return {
          ...card,
          quantity: quantityMap[card.card_id] || 0,
        };
      });

      return reply.send({
        count: result.length,
        results: { ...deck, cards: result as CollectionCard[] } as DeckApi,
      });
    },
  );

  fastify.delete<DeleteApiRoutes["/user/:id/deck/:deck_id"]>(
    "/user/:id/deck/:card_id",
    async (request, reply) => {
      const { id, deck_id } = request.params;

      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));

      if (!user) {
        return reply.status(404).send();
      }

      const decks = user.decks as User["decks"];
      const deckIndex = decks.findIndex((deck) => deck.id === deck_id);

      if (deckIndex === -1) {
        return reply.status(404).send();
      }

      decks.splice(deckIndex, 1);

      await db
        .update(usersTable)
        .set({ decks: JSON.stringify(decks) })
        .where(eq(usersTable.id, id));

      return reply.send({
        count: decks.length,
        results: decks as DeckApi[],
      });
    },
  );
}
