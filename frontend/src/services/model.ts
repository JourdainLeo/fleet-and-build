import type { User } from "@fleet-and-build/types";
import type { IApi } from "@frontend/services/api";
import type React from "react";

export interface IServices {
  store: IStore;
  api: IApi;
}

export interface IStore {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}
