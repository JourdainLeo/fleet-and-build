import type { ApiRoutes } from "@fleet-and-build/api";
import React, { createContext, useContext } from "react";

const BASE_URL = "http://localhost:3000";

export class IApi {
  async post<T extends keyof ApiRoutes>(
    route: T,
    body: ApiRoutes[T]["POST"]["Body"],
  ): Promise<ApiRoutes[T]["POST"]["Reply"]> {
    return fetch(`${BASE_URL}${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json());
  }

  async get<T extends keyof ApiRoutes>(
    route: T,
  ): Promise<ApiRoutes[T]["GET"]["Reply"]> {
    return fetch(`${BASE_URL}${route}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  }
}

const ApiContext = createContext<IApi>({} as IApi);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const apiClient = new IApi();
  return (
    <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>
  );
};

export const useApi = () => {
  return useContext(ApiContext);
};
