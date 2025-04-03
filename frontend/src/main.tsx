import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./routes/__root";
import { ApiProvider } from "./services/api";
import { StoreProvider } from "./services/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme={"dark"}>
      <Notifications />
      <ApiProvider>
        <StoreProvider>
          <RouterProvider router={router} />
        </StoreProvider>
      </ApiProvider>
    </MantineProvider>
  </StrictMode>,
);
