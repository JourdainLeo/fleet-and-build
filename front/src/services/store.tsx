import type { Card, User } from "@fleet-and-build/api";
import React, { createContext, useContext, useState } from "react";
import type { IStore } from "./model";

export const Store = createContext<IStore>({} as IStore);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>();
  const baseUrl = "https://cards.fabtcg.com/api/search/v1/cards/";
  const [cards, setCards] = useState<Card[]>([]);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [grid, setGrid] = useState({
    lg: 1.714,
    sm: 3,
    xs: 4,
    md: 3,
  });

  const fetchCards = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("failed to load cards");

    const data = await response.json();
    setCards(data.results);
    setCount(data.count);
  };

  return (
    <Store.Provider
      value={{
        user,
        setUser,
        baseUrl,
        cards,
        setCards,
        count,
        setCount,
        loading,
        setLoading,
        fetchCards,
        grid,
        setGrid,
      }}
    >
      {children}
    </Store.Provider>
  );
};

export const useStore = () => {
  return useContext(Store);
};
