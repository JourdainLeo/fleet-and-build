import type { IApi } from "@frontend/services/api";

export interface IServices {
  store: IStore;
  api: IApi;
}

export interface IStore {}
