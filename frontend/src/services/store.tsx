import React, { createContext, useContext } from "react";
import type { IStore } from "./model";

export const Store = createContext<IStore>({} as IStore);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Store.Provider value={{}}>{children}</Store.Provider>;
};

export const useStore = () => {
  return useContext(Store);
};
