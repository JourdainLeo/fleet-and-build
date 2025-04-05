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

  const SearchEngine = (item: Card): Card => {
    const card_id = item.card_id
      .replace("-1", "-red")
      .replace("-2", "-yellow")
      .replace("-3", "-blue");
    const res = cards.find((c) => card_id.includes(c.cardIdentifier));
    console.log(card_id);
    console.log(res);
    console.log(cards);
    if (res) {
      item["artists"] = res.artists;
      item["classes"] = res.classes;
      item["sets"] = res.sets;
      item["rarities"] = res.rarities;
      item["types"] = res.types;
      item["subtypes"] = res.subtypes;
      item["legalHeroes"] = res.legalHeroes;
      item["legalFormats"] = res.legalFormats;
      return item;
    }

    return item;
  };

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
                    disabled={
                      !store.user?.collection.find(
                        (c) => c.card_id === item.card_id,
                      )?.quantity
                    }
                    className="card-button"
                    icon={<IconMinus />}
                    onClick={async ({ api }) => {
                      await api.delete(
                        "/user/:id/collection/:card_id",
                        {
                          id: 1,
                          card_id: item.card_id,
                        },
                        (json) => {
                          store.setUser(json);
                        },
                      );
                    }}
                  />
                  <Text fw={900} size={"20"}>
                    {store.user?.collection
                      .find((c) => c.card_id === item.card_id)
                      ?.quantity.toString() || "0"}
                  </Text>
                  <Action
                    className="card-button"
                    icon={<IconPlus />}
                    onClick={async ({ api }) => {
                      const copy = { ...item };

                      const item2 = SearchEngine(item);

                      if (!item2) {
                        return;
                      }

                      console.log(item2);

                      await api.put(
                        "/user/:id/collection",
                        copy,
                        {
                          id: 1,
                        },
                        (json) => {
                          store.setUser(json);
                        },
                      );
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
