import { AppShell, Burger, Button, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, Outlet } from "@tanstack/react-router";

function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group
          h="100%"
          px="md"
          justify="space-between"
          style={{ position: "relative" }}
        >
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text>Test</Text>
          </Group>

          <Group
            visibleFrom="sm"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Button component={Link} to="/" variant="subtle">
              Home
            </Button>
            <Button component={Link} to="/search" variant="subtle">
              Search
            </Button>
            <Button component={Link} to="/collection" variant="subtle">
              Collection
            </Button>
            <Button component={Link} to="/decks" variant="subtle">
              Decks
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <Button component={Link} to="/" variant="subtle">
          Home
        </Button>
        <Button component={Link} to="/search" variant="subtle">
          Search
        </Button>
        <Button component={Link} to="/collection" variant="subtle">
          Collection
        </Button>
        <Button component={Link} to="/decks" variant="subtle">
          Decks
        </Button>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
