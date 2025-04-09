import { Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useApi } from "../services/api";
import { useZustore } from "../services/zustore";
import DeckCardGrid from "./decks/deck-card-grid";
import DeckCreate from "./decks/deck-create";
import DeckLeftbar from "./decks/deck-leftbar";

const Decks = () => {
  const api = useApi();
  const setLoading = useZustore((state) => state.setLoading);
  const setCount = useZustore((state) => state.setCount);
  const setCards = useZustore((state) => state.setCards);
  const [opened, { open, close }] = useDisclosure();
  const [hero, setHero] = useState("");
  const [name, setName] = useState("");
  const [format, setFormat] = useState<"Blitz" | "Classic Constructed">(
    "Blitz",
  );
  const loading = useZustore((state) => state.loading);
  const cards = useZustore((state) => state.cards);
  const grid = useZustore((state) => state.grid);
  const collection = useZustore((state) => state.collection);
  const deck = useZustore((state) => state.deck);
  const setDeck = useZustore((state) => state.setDeck);
  const decks = useZustore((state) => state.decks);
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
      <DeckCardGrid />
      <DeckCreate opened={opened} close={close} />
    </Flex>
  );
};

export default Decks;
