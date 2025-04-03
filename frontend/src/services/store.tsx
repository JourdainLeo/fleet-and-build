import { createContext, useContext } from "react";
import type { IStore } from "./model";

export const Store = createContext<IStore>({} as IStore);

function StoreProvider(props: any) {
  return <Store.Provider value={props} />;
}

function useStore() {
  return useContext(Store);
}

export { StoreProvider, useStore };
