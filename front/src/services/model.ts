import type { Card, User } from "@fleet-and-build/api";
import type React from "react";
import type { IApi } from "./api";

export interface IServices {
  store: IStore;
  api: IApi;
}

export interface IStore {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  baseUrl: string;
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  grid: { lg: number; sm: number; xs: number; md: number };
  setGrid: React.Dispatch<
    React.SetStateAction<{ lg: number; sm: number; xs: number; md: number }>
  >;
  fetchCards: (url: string) => Promise<void>;
}
