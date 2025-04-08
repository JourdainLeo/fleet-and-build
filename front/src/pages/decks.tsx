import { Box, Divider, Flex, Image, ScrollArea, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import Filter from "../components/Filter";
import { useApi } from "../services/api";
import { useZustore } from "../services/zustore";
import GridCards from "./search/grid-cards";

type Deck = {
  name: string;
  cards: string[];
};

// generate 5 decks, with random names and 10 random cards each
const decks: Deck[] = Array.from({ length: 5 }, (_, i) => ({
  name: `Deck ${i + 1}`,
  cards: Array.from({ length: 40 }, () =>
    Math.random().toString(36).substring(2, 15),
  ),
}));

const Decks = () => {
  const [deck, setDeck] = useState<Deck | null>(null);
  const api = useApi();
  const setLoading = useZustore((state) => state.setLoading);
  const setCount = useZustore((state) => state.setCount);
  const setCards = useZustore((state) => state.setCards);

  useEffect(() => {
    setLoading(true);
    api.get("/cards", { id: 1 }, { limit: 50, offset: 0 }).then((r) => {
      setCount(r.count);
      setCards(r.results);
      setLoading(false);
    });
  }, []);

  return (
    <Flex h={"100%"}>
      <Flex
        w={350}
        style={{ borderRight: "1px solid var(--mantine-color-dark-4)" }}
        direction={"column"}
        h={"100%"}
      >
        {!deck ? (
          <Flex align={"center"} justify={"center"} p={16}>
            <Text fw={600} fz={24}>
              My Decks
            </Text>
          </Flex>
        ) : (
          <Flex
            pt={8}
            style={{ backgroundColor: "black" }}
            w={"100%"}
            direction={"column"}
            onClick={() => {
              setDeck(null);
            }}
            className={"deck2"}
          >
            <Flex h={100} w={"100%"} className={"deck-container"}>
              <Image src={"ROS008.webp"} className={"deck-image"} />
            </Flex>
            <Flex align={"center"} pl={8}>
              <Text>{deck.name}</Text>
            </Flex>
          </Flex>
        )}
        <Divider orientation={"horizontal"} w={"100%"} />
        <ScrollArea h={"100%"}>
          <Flex p={16} direction={"column"} gap={!deck ? 16 : 3}>
            {!deck
              ? decks.map((deck, index) => (
                  <Flex
                    pt={8}
                    key={index}
                    style={{ backgroundColor: "black" }}
                    className={"deck"}
                    w={"100%"}
                    direction={"column"}
                    onClick={() => {
                      setDeck(deck);
                    }}
                  >
                    <Flex h={100} w={"100%"} className={"deck-container"}>
                      <Image src={"ROS008.webp"} className={"deck-image"} />
                    </Flex>
                    <Flex align={"center"} pl={8}>
                      <Text>{deck.name}</Text>
                    </Flex>
                  </Flex>
                ))
              : deck.cards.map((card, index) => (
                  <Box
                    key={index}
                    pos="relative"
                    w="100%"
                    className="card-container deck"
                  >
                    <Image
                      src={
                        index === 0
                          ? "bluemax.png"
                          : index === 1
                            ? "redmax.png"
                            : "yellowmax.png"
                      }
                    />

                    <Text
                      pos="absolute"
                      top="50%"
                      left="50%"
                      style={{ transform: "translate(-50%, -40%)" }}
                      size="lg"
                      ta="center"
                      c={"black"}
                      className={"deck-card"}
                    >
                      Aether Arc
                    </Text>
                  </Box>
                ))}
          </Flex>
        </ScrollArea>
      </Flex>
      <Flex flex={1}>
        <Filter
          fetch={(query) => {
            api.get("/cards", { id: 1 }, query).then((r) => {
              setCount(r.count);
              setCards(r.results);
              setLoading(false);
            });
          }}
        >
          <GridCards />
        </Filter>
      </Flex>
    </Flex>
  );
};

export default Decks;
