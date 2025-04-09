import type { CollectionCard, DeckApi } from "@fleet-and-build/api";
import { Flex, Grid, Image, ScrollArea, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Action } from "../../components/Action";
import Filter from "../../components/Filter";
import { useApi } from "../../services/api";
import { useZustore } from "../../services/zustore";
import LoadingCards from "../search/loading-cards";

function DeckCardGrid() {
  const deck = useZustore((state) => state.deck);
  const api = useApi();
  const cards = useZustore((state) => state.cards);
  const setCards = useZustore((state) => state.setCards);
  const setCount = useZustore((state) => state.setCount);
  const loading = useZustore((state) => state.loading);
  const setLoading = useZustore((state) => state.setLoading);
  const setDeck = useZustore((state) => state.setDeck);
  const collection = useZustore((state) => state.collection);
  const grid = useZustore((state) => state.grid);

  return (
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
        <ScrollArea h={"100%"} mr={32} ml={32}>
          <Grid gutter={16} align={"stretch"} p={16}>
            {!loading ? (
              cards.map((item) => (
                <Grid.Col key={item.card_id} span={grid} className="transition">
                  <Flex className="card">
                    <Image
                      src={item.image.normal}
                      fit="contain"
                      className="card-image fade-in"
                      loading={"lazy"}
                    />

                    <Flex className="hover-bar" gap={16}>
                      <Action
                        disabled={
                          !collection.find((c) => c.card_id === item.card_id)
                            ?.quantity
                        }
                        className="card-button"
                        icon={<IconMinus />}
                        onClick={() => {
                          const newDeck = {
                            ...deck,
                            cards: deck?.cards.reduce((acc, c) => {
                              if (c.card_id === item.card_id) {
                                const newQuantity = c.quantity - 1;
                                if (newQuantity > 0) {
                                  acc.push({ ...c, quantity: newQuantity });
                                }
                              } else {
                                acc.push(c);
                              }
                              return acc;
                            }, [] as CollectionCard[]),
                          };

                          setDeck(newDeck as DeckApi);
                        }}
                      />
                      <Text fw={900} size={"20"}>
                        {collection
                          .find((c) => c.card_id === item.card_id)
                          ?.quantity.toString() || "0"}
                      </Text>
                      <Action
                        className="card-button"
                        icon={<IconPlus />}
                        onClick={() => {
                          const newDeck = {
                            ...deck,
                            cards: (() => {
                              let found = false;

                              const updatedCards = deck?.cards.reduce(
                                (acc, c) => {
                                  if (c.card_id === item.card_id) {
                                    found = true;
                                    acc.push({
                                      ...c,
                                      quantity: c.quantity + 1,
                                    });
                                  } else {
                                    acc.push(c);
                                  }
                                  return acc;
                                },
                                [] as typeof deck.cards,
                              );

                              if (!found && updatedCards) {
                                updatedCards.push({
                                  ...item,
                                  quantity: 1,
                                } as CollectionCard);
                              }

                              return updatedCards;
                            })(),
                          };

                          setDeck(newDeck as DeckApi);
                        }}
                      />
                    </Flex>
                  </Flex>
                </Grid.Col>
              ))
            ) : (
              <LoadingCards />
            )}
          </Grid>
        </ScrollArea>
      </Filter>
    </Flex>
  );
}

export default DeckCardGrid;
