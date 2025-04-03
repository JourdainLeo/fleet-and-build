import type { GetApiRoutes, PostApiRoutes } from "@fleet-and-build/api";
import React, { createContext, useContext } from "react";

const BASE_URL = "http://localhost:3000";

export class IApi {
  async post<T extends keyof PostApiRoutes>(
    route: T,
    body: PostApiRoutes[T]["POST"]["Body"],
  ): Promise<PostApiRoutes[T]["POST"]["Reply"]> {
    return fetch(`${BASE_URL}${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json());
  }

  async get<T extends keyof GetApiRoutes>(
    route: T,
    params: GetApiRoutes[T]["GET"]["Params"],
  ): Promise<GetApiRoutes[T]["GET"]["Reply"]> {
    const url = route.replace(/:(\w+)/g, (_, key) => {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        return encodeURIComponent(String(params[key as keyof typeof params]));
      }
      throw new Error(`Missing parameter: ${key}`);
    });

    return fetch(`${BASE_URL}${url}`, {
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
