import type { Card, CollectionCard, User } from "@fleet-and-build/api";
import { create } from "zustand";

interface StoreState {
  user?: User;
  setUser: (u: User | undefined) => void;

  cards: Card[];
  setCards: (cards: Card[]) => void;

  collection: CollectionCard[];
  setCollection: (c: CollectionCard[]) => void;

  count: number;
  setCount: (n: number) => void;

  loading: boolean;
  setLoading: (b: boolean) => void;

  q: string;
  setQ: (q: string) => void;

  debounced: string; // handled externally, explained below

  grid: {
    lg: number;
    sm: number;
    xs: number;
    md: number;
  };
  setGrid: (grid: StoreState["grid"]) => void;

  hero?: string;
  set?: string;
  type?: string;
  rarity?: string;
  fusion?: string;
  artist?: string;

  pitch?: 1 | 2 | 3;
  pitch_operator?: "=" | "<" | ">" | "<=" | ">=";

  defense?: number;
  defense_operator?: "=" | "<" | ">" | "<=" | ">=";

  attack?: number;
  attack_operator?: "=" | "<" | ">" | "<=" | ">=";

  cost?: number;
  cost_operator?: "=" | "<" | ">" | "<=" | ">=";

  order: "asc" | "desc";

  setFilter: <K extends keyof Omit<StoreState, "setFilter">>(
    key: K,
    value: StoreState[K],
  ) => void;

  getActiveFilters: () => {
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
  };
}

export const useZustore = create<StoreState>((set, get) => ({
  user: undefined,
  setUser: (u) => set({ user: u }),

  cards: [],
  setCards: (cards) => set({ cards }),

  collection: [],
  setCollection: (collection) => set({ collection }),

  count: 50,
  setCount: (n) => set({ count: n }),

  loading: true,
  setLoading: (b) => set({ loading: b }),

  q: "",
  setQ: (q) => set({ q }),

  debounced: "", // you can update this from outside (see below)

  grid: {
    lg: 1.714,
    sm: 3,
    xs: 4,
    md: 3,
  },
  setGrid: (grid) => set({ grid }),

  hero: undefined,
  set: undefined,
  type: undefined,
  rarity: undefined,
  fusion: undefined,
  artist: undefined,
  pitch: undefined,
  pitch_operator: "=",
  defense: undefined,
  defense_operator: "=",
  attack: undefined,
  attack_operator: "=",
  cost: undefined,
  cost_operator: "=",
  order: "asc",

  setFilter: (key, value) => set({ [key]: value }),

  getActiveFilters: () => {
    const state = get();
    return {
      hero: state.hero,
      set: state.set,
      type: state.type,
      rarity: state.rarity,
      fusion: state.fusion,
      artist: state.artist,
      pitch: state.pitch,
      pitch_operator: state.pitch_operator,
      defense: state.defense,
      defense_operator: state.defense_operator,
      attack: state.attack,
      attack_operator: state.attack_operator,
      cost: state.cost,
      cost_operator: state.cost_operator,
      order: state.order,
    };
  },
}));
