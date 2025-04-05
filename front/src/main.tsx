import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./routes/__root";
import { ApiProvider } from "./services/api";

const theme = createTheme({
  colors: {
    customRed: [
      "#ffe5e5",
      "#ffb3b3",
      "#ff8080",
      "#ff4d4d",
      "#ff1a1a",
      "#e60000",
      "#cc0000",
      "#b30000",
      "#990000",
      "#6f0000",
    ],
  },
  primaryColor: "customRed",
  components: {
    ActionIcon: {
      styles: () => ({
        root: {
          borderRadius: "16px",
        },
      }),
    },
    Button: {
      styles: () => ({
        root: {
          borderRadius: "16px",
        },
      }),
    },
    Skeleton: {
      styles: () => ({
        root: {
          borderRadius: "16px",
        },
      }),
    },
    Card: {
      styles: () => ({
        root: {
          borderRadius: "16px",
        },
      }),
    },
    Modal: {
      styles: () => ({
        root: {
          borderRadius: "16px",
        },
      }),
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme={"dark"} theme={theme}>
      <Notifications />
      <ApiProvider>
        <RouterProvider router={router} />
      </ApiProvider>
    </MantineProvider>
  </StrictMode>,
);
