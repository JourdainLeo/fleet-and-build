import type { Card, CollectionCard, User } from "@fleet-and-build/api";
import { useDebouncedValue } from "@mantine/hooks";
import React, { createContext, useContext, useState } from "react";
import type { IStore } from "./model";

export const Store = createContext<IStore>({} as IStore);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>();
  const [cards, setCards] = useState<Card[]>([]);
  const [collection, setCollection] = useState<CollectionCard[]>([]);
  const [count, setCount] = useState(50);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debounced] = useDebouncedValue(query, 200);
  const [grid, setGrid] = useState({
    lg: 1.714,
    sm: 3,
    xs: 4,
    md: 3,
  });

  return (
    <Store.Provider
      value={{
        user,
        setUser,
        cards,
        setCards,
        count,
        setCount,
        loading,
        setLoading,
        grid,
        debounced,
        setQuery,
        query,
        setGrid,
        collection,
        setCollection,
      }}
    >
      {children}
    </Store.Provider>
  );
};

export const useStore = () => {
  return useContext(Store);
};
