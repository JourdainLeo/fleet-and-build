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
import { StoreProvider } from "./services/store";

const theme = createTheme({
  colors: {
    customRed: [
      "#ffe5e5", // 0
      "#ffb3b3", // 1
      "#ff8080", // 2
      "#ff4d4d", // 3
      "#ff1a1a", // 4
      "#e60000", // 5
      "#cc0000", // 6
      "#b30000", // 7
      "#990000", // 8
      "#6f0000", // 9 (darkest shade, your hex)
    ],
  },
  primaryColor: "customRed", // Use the custom color scale
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme={"dark"} theme={theme}>
      <Notifications />
      <ApiProvider>
        <StoreProvider>
          <RouterProvider router={router} />
        </StoreProvider>
      </ApiProvider>
    </MantineProvider>
  </StrictMode>,
);
