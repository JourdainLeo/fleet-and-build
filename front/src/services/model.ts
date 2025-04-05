import type { Card, CollectionCard, User } from "@fleet-and-build/api";
import type React from "react";
import type { IApi } from "./api";

export interface IServices {
  api: IApi;
}

export interface Filters {
  limit?: number;
  offset?: number;
  hero?: string;
  set?: string;
  type?: string;
  rarity?: string;
  fusion?: string;
  artist?: string;
  pitch?: number;
  pitch_operator?: string;
  defense?: number;
  defense_operator?: string;
  attack?: number;
  attack_operator?: string;
  cost?: number;
  cost_operator?: string;
}

export interface IStore {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  collection: CollectionCard[];
  setCollection: React.Dispatch<React.SetStateAction<CollectionCard[]>>;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  q: string;
  setQ: React.Dispatch<React.SetStateAction<string>>;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  grid: { lg: number; sm: number; xs: number; md: number };
  setGrid: React.Dispatch<
    React.SetStateAction<{ lg: number; sm: number; xs: number; md: number }>
  >;
  debounced: string;
}
