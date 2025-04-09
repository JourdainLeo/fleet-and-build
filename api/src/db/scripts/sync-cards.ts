// scripts/sync-cards.ts
import { cards as enrichedCards } from "@flesh-and-blood/cards";
import type { Card as FabCard } from "@flesh-and-blood/types";
import "dotenv/config";
import { cardsTable } from "../table";

const API_URL = "https://cards.fabtcg.com/api/search/v1/cards";
const LIMIT = 100;

import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: "postgres://root:root@localhost:5432/fab",
});

export const db = drizzle(pool);

export interface FabApiCard {
  card_id: string;
  card_type: string;
  display_name: string;
  name: string;
  pitch: string;
  cost: string;
  defense: string;
  life: string;
  intellect: string;
  power: string;
  object_type: string;
  text: string;
  text_html: string;
  typebox: string;
  url: string;
  image: {
    small: string;
    normal: string;
    large: string;
  };
  back_face: string | null;
}

function enrichCard(baseCard: FabApiCard, index: number): any {
  const enrichedMap = new Map<string, FabCard>();
  for (const c of enrichedCards) {
    enrichedMap.set(c.cardIdentifier, c);
  }

  const found = enrichedCards.slice(index).find((c) => {
    const match = baseCard.image.normal.match(/\/([^/]+)\.webp$/);
    const result = match ? match[1] : null;
    if (result) {
      if (c.setIdentifiers.some((id) => result.includes(id))) {
        return c;
      }
    }
  });

  if (found) {
    return {
      card_id: baseCard.card_id,
      name: baseCard.name,
      image: baseCard.image,
      sets: found.sets,
      rarities: found.rarities,
      classes: found.classes,
      types: found.types,
      subtypes: found.subtypes,
      legalHeroes: found.legalHeroes,
      legalFormats: found.legalFormats,
      pitch: found.pitch,
      power: found.power,
      defense: found.defense,
      cost: found.cost,
      life: found.life,
      artists: found.artists,
      other: {
        back_face: baseCard.back_face,
        card_type: baseCard.card_type,
        object_type: baseCard.object_type,
        text: baseCard.text,
        text_html: baseCard.text_html,
        typebox: baseCard.typebox,
        url: baseCard.url,
        intellect: baseCard.intellect,
        display_name: baseCard.display_name,
      },
    };
  }

  if (baseCard.card_id.includes("dragons-of-legend")) {
    return {
      card_id: baseCard.card_id,
      name: baseCard.name,
      image: baseCard.image,
      sets: ["Uprising"],
      rarities: [],
      classes: [],
      types: [],
      subtypes: [],
      legalHeroes: [],
      legalFormats: [],
      artists: ["MJ Fetesjo"],
      other: {
        back_face: baseCard.back_face,
        card_type: baseCard.card_type,
        object_type: baseCard.object_type,
        text: baseCard.text,
        text_html: baseCard.text_html,
        typebox: baseCard.typebox,
        url: baseCard.url,
        intellect: baseCard.intellect,
        display_name: baseCard.display_name,
      },
    };
  }

  if (baseCard.card_id.includes("placeholder-equipment")) {
    return {
      card_id: baseCard.card_id,
      name: baseCard.name,
      image: baseCard.image,
      sets: [],
      rarities: [],
      classes: [],
      types: [],
      subtypes: [],
      legalHeroes: [],
      legalFormats: [],
      artists: [],
      other: {
        back_face: baseCard.back_face,
        card_type: baseCard.card_type,
        object_type: baseCard.object_type,
        text: baseCard.text,
        text_html: baseCard.text_html,
        typebox: baseCard.typebox,
        url: baseCard.url,
        intellect: baseCard.intellect,
        display_name: baseCard.display_name,
      },
    };
  }

  throw new Error(`Card not found: ${baseCard.card_id}`);
}

async function fetchAllCards() {
  let allCards: any[] = [];
  let offset = 0;
  let total = 0;

  do {
    const res = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);
    if (!res.ok) throw new Error("API fetch failed");

    const data = await res.json();
    total = data.count;

    allCards = [...allCards, ...data.results];
    offset += LIMIT;

    console.log(`Fetched ${allCards.length}/${total}`);
  } while (offset < total); //replace with total

  return allCards;
}

async function sync() {
  const baseCards = await fetchAllCards();
  const dbInsert = baseCards.map((card, i) => enrichCard(card, i));

  await db.delete(cardsTable);

  const chunkSize = 1000;
  for (let i = 0; i < dbInsert.length; i += chunkSize) {
    const chunk = dbInsert.slice(i, i + chunkSize);
    console.log(chunk);
    await db.insert(cardsTable).values(chunk);
    console.log(`Inserted ${i + chunk.length} cards`);
  }

  console.log("✅ Sync complete!");
}

sync().catch(console.error);
