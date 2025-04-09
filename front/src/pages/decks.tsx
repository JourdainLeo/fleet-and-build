import { DndContext, useDroppable } from "@dnd-kit/core";
import type { CollectionCard, DeckApi } from "@fleet-and-build/api";
import {
  Box,
  Divider,
  Flex,
  Grid,
  Image,
  Modal,
  ScrollArea,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconClipboard,
  IconCopy,
  IconDeviceGamepad,
  IconInputX,
  IconMinus,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Action } from "../components/Action";
import Filter from "../components/Filter";
import { useApi } from "../services/api";
import { useZustore } from "../services/zustore";
import CardDraggable from "./CardDraggable";
import { heroes, Select } from "./search/filter-modal";
import LoadingCards from "./search/loading-cards";

const Decks = () => {
  const [deck, setDeck] = useState<DeckApi | null>(null);
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
  const { setNodeRef } = useDroppable({
    id: "deck-dropzone",
  });
  const [decks, setDecks] = useState<DeckApi[]>([]);
  const loading = useZustore((state) => state.loading);
  const cards = useZustore((state) => state.cards);
  const grid = useZustore((state) => state.grid);
  const collection = useZustore((state) => state.collection);

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
    <DndContext
      onDragEnd={({ over, active }) => {
        if (over?.id === "deck-dropzone" && deck) {
          const droppedCard = cards.find((c) => c.card_id === active.id);
          if (!droppedCard) return;

          const newDeck = {
            ...deck,
            cards: (() => {
              let found = false;

              const updatedCards = deck.cards.reduce(
                (acc, c) => {
                  if (c.card_id === droppedCard.card_id) {
                    found = true;
                    acc.push({ ...c, quantity: c.quantity + 1 });
                  } else {
                    acc.push(c);
                  }
                  return acc;
                },
                [] as typeof deck.cards,
              );

              if (!found) {
                updatedCards.push({
                  ...droppedCard,
                  quantity: 1,
                } as CollectionCard);
              }

              return updatedCards;
            })(),
          };

          setDeck(newDeck);
        }
      }}
    >
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
              className={"deck2"}
            >
              <Flex h={100} w={"100%"} className={"deck-container"}>
                <Image src={deck.image} className={"deck-image"} />
              </Flex>
              <Flex align={"center"} justify={"space-between"} pl={8}>
                <Flex align={"center"}>
                  <Text>{deck.name}</Text>
                  <Action
                    icon={<IconPencil size={16} color={"gray"} />}
                    variant={"subtle"}
                  />
                </Flex>
                <Flex>
                  <Action
                    icon={<IconClipboard size={16} color={"gray"} />}
                    variant={"subtle"}
                  />
                  <Action
                    icon={<IconCopy size={16} color={"gray"} />}
                    variant={"subtle"}
                  />
                  <Action
                    icon={<IconTrash size={16} color={"gray"} />}
                    variant={"subtle"}
                  />
                </Flex>
              </Flex>
            </Flex>
          )}
          <Divider orientation={"horizontal"} w={"100%"} />
          <ScrollArea h={"100%"} ref={setNodeRef}>
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
                        <Image src={deck.image} className={"deck-image"} />
                      </Flex>
                      <Flex align={"center"} pl={8} justify={"space-between"}>
                        <Flex align={"center"}>
                          <Text>{deck.name}</Text>
                          <Action
                            icon={<IconPencil size={16} color={"gray"} />}
                            variant={"subtle"}
                          />
                        </Flex>
                        <Flex>
                          <Action
                            icon={<IconClipboard size={16} color={"gray"} />}
                            variant={"subtle"}
                          />
                          <Action
                            icon={<IconCopy size={16} color={"gray"} />}
                            variant={"subtle"}
                          />
                          <Action
                            icon={<IconTrash size={16} color={"gray"} />}
                            variant={"subtle"}
                          />
                        </Flex>
                      </Flex>
                    </Flex>
                  ))
                : deck.cards.map((card, index) => (
                    <Box
                      key={index}
                      pos="relative"
                      w="100%"
                      className="card-container deck deck-card-container"
                    >
                      <Image
                        src={
                          card.pitch === 1
                            ? "redmax.png"
                            : card.pitch === 2
                              ? "yellowmax.png"
                              : "bluemax.png"
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
                        {card.name}
                      </Text>
                      <Flex
                        pos="absolute"
                        bottom={4}
                        left="50%"
                        style={{
                          transform: "translateX(-50%)",
                          zIndex: 1000,
                          borderRadius: 16,
                        }}
                        bg="rgba(0,0,0,0.6)"
                        p={4}
                        pl={7}
                        pr={7}
                        gap={8}
                        className="deck-hover-bar"
                        justify={"space-between"}
                      >
                        <Action icon={<IconMinus />} size={"lg"} />
                        <Action icon={<IconPlus />} />
                      </Flex>
                      <Text
                        pos="absolute"
                        top={12}
                        right={49}
                        fw={700}
                        fz="sm"
                        px={6}
                        py={2}
                        bg="rgba(0,0,0,1)"
                        c="white"
                        style={{ borderRadius: 8 }}
                      >
                        {card.quantity}
                      </Text>
                      <Text
                        pos="absolute"
                        top={10}
                        right={7}
                        fz={18}
                        fw={600}
                        w={32}
                        c="black"
                        style={{ borderRadius: 8, textAlign: "center" }}
                        className={"deck-card"}
                      >
                        {card.quantity}
                      </Text>
                    </Box>
                  ))}
            </Flex>
          </ScrollArea>
          <Divider orientation={"horizontal"} w={"100%"} />
          <Flex p={8} style={{ backgroundColor: "black" }} justify={"flex-end"}>
            {deck ? (
              <Action
                label={"Done"}
                onClick={() => {
                  setDeck(null);
                }}
              />
            ) : (
              <Action label={"Create"} onClick={open} />
            )}
          </Flex>
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
            <ScrollArea h={"100%"} mr={32} ml={32}>
              <Grid gutter={16} align={"stretch"} p={16}>
                {!loading ? (
                  cards.map((item) => (
                    <Grid.Col
                      key={item.card_id}
                      span={grid}
                      className="card-container"
                    >
                      <Flex className="card">
                        <CardDraggable card={item} />

                        <Flex className="hover-bar" gap={16}>
                          <Action
                            disabled={
                              !collection.find(
                                (c) => c.card_id === item.card_id,
                              )?.quantity
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
        <Modal
          opened={opened}
          onClose={close}
          centered
          radius={16}
          title={"Create Deck"}
        >
          <Flex direction={"column"} gap={16}>
            <TextInput
              placeholder={"Deck Name"}
              label={
                <Flex align={"center"} gap={4}>
                  <IconInputX width={14} height={14} />
                  <Text fz={14}>
                    Name{" "}
                    <Text span c="red" ml={4}>
                      *
                    </Text>
                  </Text>
                </Flex>
              }
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Select
              label={
                <Flex align={"center"} gap={4}>
                  <Image src={"hp.png"} w={14} h={14} />
                  <Text fz={14}>
                    Hero{" "}
                    <Text span c="red" ml={4}>
                      *
                    </Text>
                  </Text>
                </Flex>
              }
              data={heroes}
              value={hero}
              onChange={(v) => {
                setHero(v ?? "");
              }}
            />
            <Select
              label={
                <Flex align={"center"} gap={4}>
                  <IconDeviceGamepad width={14} height={14} />
                  <Text fz={14}>Format</Text>
                </Flex>
              }
              data={["Blitz", "Classic Constructed"]}
              defaultValue={"Blitz"}
              value={format}
              onChange={(v) => {
                setFormat((v as any) ?? "Blitz");
              }}
            />
            <Flex justify={"flex-end"}>
              <Action
                label={"create"}
                disabled={!name || !hero}
                onClick={({ api }) => {
                  api
                    .post(
                      "/user/:id/deck",
                      { id: 1 },
                      {
                        name: name,
                        hero: hero,
                        type: format,
                      },
                    )
                    .then((r) => {
                      setDecks(r.results);
                      close();
                      setName("");
                      setHero("");
                      setFormat("Blitz");
                    });
                }}
              />
            </Flex>
          </Flex>
        </Modal>
      </Flex>
    </DndContext>
  );
};

export default Decks;
