import { and, asc, count, desc } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { db } from "../db";
import { cardsTable } from "../db/table";
import type { Card, GetApiRoutes } from "../types";
import { queryBuilder } from "./utils/buildQuery";

export async function cardsRoutes(fastify: FastifyInstance) {
  fastify.get<GetApiRoutes["/cards"]>("/cards", async (request, reply) => {
    const query = request.query as GetApiRoutes["/cards"]["Query"];

    const where = queryBuilder(query);

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

    if (!cards) {
      return reply.status(404).send();
    }

    const total = await db.select({ count: count() }).from(cardsTable);

    return reply.send({
      count: total[0].count,
      results: cards as Card[],
    });
  });
}
