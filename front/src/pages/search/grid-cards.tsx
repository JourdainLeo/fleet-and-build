import { Flex, Grid, Image, ScrollArea, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Action } from "../../components/Action";
import { useStore } from "../../services/store";
import LoadingCards from "./loading-cards";

function GridCards() {
  const store = useStore();

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
                      !store.collection.find((c) => c.card_id === item.card_id)
                        ?.quantity
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
                          store.setCollection(json);
                        },
                      );
                    }}
                  />
                  <Text fw={900} size={"20"}>
                    {store.collection
                      .find((c) => c.card_id === item.card_id)
                      ?.quantity.toString() || "0"}
                  </Text>
                  <Action
                    className="card-button"
                    icon={<IconPlus />}
                    onClick={async ({ api }) => {
                      await api.put(
                        "/user/:id/collection",
                        { card_id: item.card_id },
                        {
                          id: 1,
                        },
                        (json) => {
                          store.setCollection(json);
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
