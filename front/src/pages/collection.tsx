import type { Card } from "@fleet-and-build/api";
import {
  Button,
  Flex,
  Grid,
  Image,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Action } from "../components/Action";
import { useApi } from "../services/api";
import { useStore } from "../services/store";

function Collection() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const store = useStore();
  const api = useApi();
  useEffect(() => {
    const fetchCards = async () => {
      const response = await api.get("/user/:id", { id: 1 });
      store.setUser(response);
      setCards(response.collection);
    };

    fetchCards();
  }, []);

  return (
    <Flex flex={1} h={"82vh"}>
      <Flex flex={1} direction={"column"} gap={16} h="100%">
        <TextInput
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Search for a card..."
        />
        <Flex flex={1} h={"100%"}>
          <ScrollArea h={"100%"} w="100%" flex={1}>
            <Grid gutter={16} align={"stretch"}>
              {cards.map((item, index) => (
                <Grid.Col
                  key={index}
                  span={{ lg: 1.714, sm: 3, xs: 4, md: 3, xl: 2 }}
                  className="card-container"
                >
                  <Flex className="card">
                    <Image
                      src={item.image.normal}
                      fit="contain"
                      className="card-image"
                    />
                    <Flex className="hover-bar">
                      <Action
                        className="card-button"
                        icon={<IconPlus />}
                        label={item.quantity.toString()}
                        onClick={async ({ api, store }) => {
                          try {
                            const user = await api.put(
                              "/user/:id/collection",
                              item,
                              { id: 1 },
                            );

                            store.setUser(user);

                            notifications.show({
                              message: "Card added!",
                              color: "green",
                              position: "top-right",
                            });
                          } catch (error) {
                            notifications.show({
                              message: "Error adding card.",
                              color: "red",
                              position: "top-right",
                            });
                          }
                        }}
                      />
                    </Flex>
                  </Flex>
                </Grid.Col>
              ))}
            </Grid>
          </ScrollArea>
        </Flex>
        <Flex align={"center"} justify={"center"} gap={16}>
          <Button>Previous</Button>
          <Button>Next</Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Collection;
