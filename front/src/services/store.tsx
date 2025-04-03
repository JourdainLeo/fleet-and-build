import type { User } from "@fleet-and-build/api";
import React, { createContext, useContext, useState } from "react";
import type { IStore } from "./model";

export const Store = createContext<IStore>({} as IStore);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>();
  return <Store.Provider value={{ user, setUser }}>{children}</Store.Provider>;
};

export const useStore = () => {
  return useContext(Store);
};
