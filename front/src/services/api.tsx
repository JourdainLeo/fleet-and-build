import type {
  DeleteApiRoutes,
  GetApiRoutes,
  PostApiRoutes,
  PutApiRoutes,
} from "@fleet-and-build/api";
import { notifications } from "@mantine/notifications";
import React, { createContext, useContext } from "react";

const BASE_URL = "http://localhost:3000";

export class IApi {
  async get<T extends keyof GetApiRoutes>(
    route: T,
    params: GetApiRoutes[T]["Params"],
    query?: GetApiRoutes[T]["Query"],
  ): Promise<GetApiRoutes[T]["Reply"]> {
    const urlPath = route.replace(/:(\w+)/g, (_, key) => {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        return encodeURIComponent(String(params[key as keyof typeof params]));
      }
      throw new Error(`Missing parameter: ${key}`);
    });

    const queryString = query
      ? "?" +
        Object.entries(query)
          .filter(([, value]) => value !== undefined)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
          )
          .join("&")
      : "";

    const res = await fetch(`${BASE_URL}${urlPath}${queryString}`, {
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
    params: PostApiRoutes[T]["Params"],
    body: PostApiRoutes[T]["Body"],
  ): Promise<PostApiRoutes[T]["Reply"]> {
    const urlPath = route.replace(/:(\w+)/g, (_, key) => {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        return encodeURIComponent(String(params[key as keyof typeof params]));
      }
      throw new Error(`Missing parameter: ${key}`);
    });

    const res = await fetch(`${BASE_URL}${urlPath}`, {
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
    callback: (json: PutApiRoutes[T]["Reply"]) => void,
  ): Promise<void> {
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
      notifications.show({
        message: "Error adding card: 404",
        color: "red",
        position: "bottom-right",
      });
      return;
    }

    notifications.show({
      message: "Card added!",
      color: "green",
      position: "bottom-right",
    });

    callback(await res.json());
  }

  async delete<T extends keyof DeleteApiRoutes>(
    route: T,
    params: DeleteApiRoutes[T]["Params"],
    callback: (json: DeleteApiRoutes[T]["Reply"]) => void,
  ): Promise<void> {
    const url = route.replace(/:(\w+)/g, (_, key) => {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        return encodeURIComponent(String(params[key as keyof typeof params]));
      }
      throw new Error(`Missing parameter: ${key}`);
    });

    const res = await fetch(`${BASE_URL}${url}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      notifications.show({
        message: "Error removing card: 404",
        color: "red",
        position: "bottom-right",
      });
      return;
    }

    notifications.show({
      message: "Card removed!",
      color: "green",
      position: "bottom-right",
    });

    callback(await res.json());
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
