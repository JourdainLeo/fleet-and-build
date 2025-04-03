import type { User } from "@fleet-and-build/api";
import type React from "react";
import type { IApi } from "./api";

export interface IServices {
  store: IStore;
  api: IApi;
}

export interface IStore {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}
