import { Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { useApi } from "../services/api";
import { useZustore } from "../services/zustore";
import DeckCreate from "./decks/DeckCreate";
import DeckLeftbar from "./decks/DeckLeftbar";
import DeckSearch from "./decks/DeckSearch";

const Decks = () => {
  const api = useApi();
  const setLoading = useZustore((state) => state.setLoading);
  const setCount = useZustore((state) => state.setCount);
  const setCards = useZustore((state) => state.setCards);
  const [opened, { open, close }] = useDisclosure();
  const setDecks = useZustore((state) => state.setDecks);

  useEffect(() => {
    setLoading(true);
    api.get("/cards", { id: 1 }, { limit: 50, offset: 0 }).then((r) => {
      setCount(r.count);
      setCards(r.results);
      setLoading(false);
    });
    api.get("/user/:id/decks", { id: 1 }).then((r) => {
      setDecks(r.results);
    });
  }, []);

  return (
    <Flex h={"100%"}>
      <DeckLeftbar open={open} />
      <DeckSearch />
      <DeckCreate opened={opened} close={close} />
    </Flex>
  );
};

export default Decks;
