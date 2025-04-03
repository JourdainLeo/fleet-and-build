import type {
  GetApiRoutes,
  PostApiRoutes,
  PutApiRoutes,
} from "@fleet-and-build/api";
import React, { createContext, useContext } from "react";

const BASE_URL = "http://localhost:3000";

export class IApi {
  async get<T extends keyof GetApiRoutes>(
    route: T,
    params: GetApiRoutes[T]["Params"],
  ): Promise<GetApiRoutes[T]["Reply"]> {
    const url = route.replace(/:(\w+)/g, (_, key) => {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        return encodeURIComponent(String(params[key as keyof typeof params]));
      }
      throw new Error(`Missing parameter: ${key}`);
    });

    const res = await fetch(`${BASE_URL}${url}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    return res.json();
  }

  async post<T extends keyof PostApiRoutes>(
    route: T,
    body: PostApiRoutes[T]["Body"],
  ): Promise<PostApiRoutes[T]["Reply"]> {
    const res = await fetch(`${BASE_URL}${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    return res.json();
  }

  async put<T extends keyof PutApiRoutes>(
    route: T,
    body: PutApiRoutes[T]["Body"],
    params: PutApiRoutes[T]["Params"],
  ): Promise<PutApiRoutes[T]["Reply"]> {
    const url = route.replace(/:(\w+)/g, (_, key) => {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        return encodeURIComponent(String(params[key as keyof typeof params]));
      }
      throw new Error(`Missing parameter: ${key}`);
    });

    const res = await fetch(`${BASE_URL}${url}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    return res.json();
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
