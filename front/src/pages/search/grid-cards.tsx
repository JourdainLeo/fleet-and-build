import type { Card } from "@fleet-and-build/api";
import { cards } from "@flesh-and-blood/cards";
import Engine from "@flesh-and-blood/search";
import { Flex, Grid, Image, ScrollArea, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Action } from "../../components/Action";
import { useStore } from "../../services/store";
import LoadingCards from "./loading-cards";

function GridCards() {
  const store = useStore();
  const engine = new Engine(cards);
  const getQuantity = (card: Card) => {
    const userCollec = store.user?.collection;
    const quantity = userCollec?.find(
      (item) => item.card_id === card.card_id,
    )?.quantity;
    if (quantity) {
      return quantity;
    } else {
      return 0;
    }
  };

  console.log(cards);

  return (
    <ScrollArea h={"100%"} mr={32} ml={32}>
      <Grid gutter={16} align={"stretch"} p={16}>
        {!store.loading ? (
          store.cards.map((item) => (
            <Grid.Col
              key={item.card_id}
              span={store.grid}
              className="card-container"
            >
              <Flex className="card">
                <Image
                  src={item.image.normal}
                  fit="contain"
                  className="card-image fade-in"
                  loading={"lazy"}
                />

                <Flex className="hover-bar" gap={16}>
                  <Action
                    disabled={getQuantity(item) < 1}
                    className="card-button"
                    icon={<IconMinus />}
                    onClick={async ({ api }) => {
                      await api.delete("/user/:id/collection/:card_id", {
                        id: 1,
                        card_id: item.card_id,
                      });
                    }}
                  />
                  <Text fw={900} size={"20"}>
                    {getQuantity(item).toString()}
                  </Text>
                  <Action
                    className="card-button"
                    icon={<IconPlus />}
                    onClick={async ({ api }) => {
                      const id = item.card_id
                        .replace("-1", "")
                        .replace("-2", "")
                        .replace("-3", " ");

                      const res = engine.search(id);

                      const copy = { ...item };

                      const color =
                        item.pitch === "1"
                          ? "-red"
                          : item.pitch === "2"
                            ? "-yellow"
                            : "-blue";

                      // find item in res.searchResults with the keyCar
                      const item2 = res.searchResults.find(
                        (c) => c.cardIdentifier === id + color,
                      );

                      if (!item2) {
                        return;
                      }

                      copy["artists"] = item2.artists;
                      copy["classes"] = item2.classes;
                      copy["sets"] = item2.sets;
                      copy["rarities"] = item2.rarities;
                      copy["types"] = item2.types;
                      copy["subtypes"] = item2.subtypes;
                      copy["legalHeroes"] = item2.legalHeroes;
                      copy["legalFormats"] = item2.legalFormats;

                      await api.put("/user/:id/collection", copy, {
                        id: 1,
                      });
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
  );
}

export default GridCards;
