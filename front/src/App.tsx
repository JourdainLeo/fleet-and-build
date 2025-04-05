import {
  AppShell,
  Burger,
  Flex,
  Group,
  Image,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApi } from "./services/api";
import { useZustore } from "./services/zustore";

function App() {
  const [opened, { toggle }] = useDisclosure();
  const api = useApi();
  const path = useRouterState({
    select: (state) => state.location.pathname,
  });

  const setUser = useZustore((state) => state.setUser);

  useEffect(() => {
    const getUser = async () => {
      const user = await api.get("/user/:id", { id: 1 });
      setUser(user);
    };
    getUser().then();
  }, []);

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      flex={1}
      h={"100%"}
      header={{
        height: 75,
      }}
      footer={{
        height: 32,
      }}
    >
      <AppShell.Header>
        <Group justify="space-between" h={75}>
          <Group pl={32}>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Image src={"icon.png"} h={38} w={38}></Image>
            <Text fw={600}>Fleet and Build</Text>
          </Group>

          <Group visibleFrom="sm" gap={0}>
            <div
              style={{
                backgroundColor: "var(--mantine-color-dark-4)",
                height: 75,
                width: 1,
              }}
            />
            <UnstyledButton
              component={Link}
              to="/"
              variant="subtle"
              className={"btn " + (path === "/" && " btn-selected")}
            >
              HOME
            </UnstyledButton>
            <div
              style={{
                backgroundColor: "var(--mantine-color-dark-4)",
                height: 75,
                width: 1,
              }}
            />
            <UnstyledButton
              component={Link}
              to="/search"
              variant="subtle"
              className={"btn " + (path === "/search" && " btn-selected")}
            >
              SEARCH
            </UnstyledButton>
            <div
              style={{
                backgroundColor: "var(--mantine-color-dark-4)",
                height: 75,
                width: 1,
              }}
            />
            <UnstyledButton
              component={Link}
              to="/collection"
              variant="subtle"
              className={"btn " + (path === "/collection" && " btn-selected")}
            >
              COLLECTION
            </UnstyledButton>
            <div
              style={{
                backgroundColor: "var(--mantine-color-dark-4)",
                height: 75,
                width: 1,
              }}
            />
            <UnstyledButton
              component={Link}
              to="/decks"
              variant="subtle"
              className={"btn " + (path === "/decks" && " btn-selected")}
            >
              DECKS
            </UnstyledButton>
            <div
              style={{
                backgroundColor: "var(--mantine-color-dark-4)",
                height: 75,
                width: 1,
              }}
            />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Footer>
        <Flex justify={"center"} align={"center"} h={"100%"}>
          <Text fz={12}>
            Created by Léo Jourdain - A non-profit fan project. © Legends
            Studio.
          </Text>
        </Flex>
      </AppShell.Footer>
      <AppShell.Navbar py="md">
        <div
          style={{
            backgroundColor: "var(--mantine-color-dark-4)",
            height: 1,
          }}
        />
        <UnstyledButton
          component={Link}
          to="/"
          variant="subtle"
          className={"btn " + (path === "/" && " btn-selected")}
        >
          HOME
        </UnstyledButton>
        <div
          style={{
            backgroundColor: "var(--mantine-color-dark-4)",
            height: 1,
          }}
        />
        <UnstyledButton
          component={Link}
          to="/search"
          variant="subtle"
          className={"btn " + (path === "/search" && " btn-selected")}
        >
          SEARCH
        </UnstyledButton>
        <div
          style={{
            backgroundColor: "var(--mantine-color-dark-4)",
            height: 1,
          }}
        />
        <UnstyledButton
          component={Link}
          to="/collection"
          variant="subtle"
          className={"btn " + (path === "/collection" && " btn-selected")}
        >
          COLLECTION
        </UnstyledButton>
        <div
          style={{
            backgroundColor: "var(--mantine-color-dark-4)",
            height: 1,
          }}
        />
        <UnstyledButton
          component={Link}
          to="/decks"
          variant="subtle"
          className={"btn " + (path === "/decks" && " btn-selected")}
        >
          DECKS
        </UnstyledButton>
        <div
          style={{
            backgroundColor: "var(--mantine-color-dark-4)",
            height: 1,
          }}
        />
      </AppShell.Navbar>

      <AppShell.Main flex={1} h={"100%"}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
