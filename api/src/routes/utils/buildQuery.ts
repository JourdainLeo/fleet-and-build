// utils/buildCardFilters.ts
import type { SQL } from "drizzle-orm";
import {
  arrayOverlaps,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  lt,
  lte,
} from "drizzle-orm";
import { cardsTable } from "../../db/table";
import type { FilterQuery } from "../../types";

export function queryBuilder(query: FilterQuery, allowedIds?: string[]): SQL[] {
  const where: SQL[] = [];

  if (allowedIds && allowedIds.length > 0) {
    where.push(inArray(cardsTable.card_id, allowedIds));
  }

  if (query.q) {
    where.push(ilike(cardsTable.card_id, `%${query.q}%`));
  }

  const pushNumericOp = (
    field: any,
    value?: number,
    op?: "=" | ">" | "<" | ">=" | "<=",
  ) => {
    if (value === undefined || op === undefined) return;
    switch (op) {
      case "=":
        where.push(eq(field, value));
        break;
      case ">":
        where.push(gt(field, value));
        break;
      case "<":
        where.push(lt(field, value));
        break;
      case ">=":
        where.push(gte(field, value));
        break;
      case "<=":
        where.push(lte(field, value));
        break;
    }
  };

  pushNumericOp(cardsTable.pitch, query.pitch, query.pitch_operator);
  pushNumericOp(cardsTable.power, query.attack, query.attack_operator);
  pushNumericOp(cardsTable.defense, query.defense, query.defense_operator);
  pushNumericOp(cardsTable.cost, query.cost, query.cost_operator);

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

  return where;
}
