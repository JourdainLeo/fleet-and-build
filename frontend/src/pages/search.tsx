import type { Card } from "@fleet-and-build/types";
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
import { useStore } from "../services/store";

function Search() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [next, setNext] = useState<string>(
    "https://cards.fabtcg.com/api/search/v1/cards/",
  );
  const store = useStore();
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
  useEffect(() => {
    const fetchCards = async () => {
      const response = await fetch(
        "https://cards.fabtcg.com/api/search/v1/cards/",
      );
      if (!response.ok) throw new Error("failed to load cards");

      const data = await response.json();
      setCards(data.results);
      setNext(data.next);
    };

    fetchCards();
  }, []);

  // get  quantity from user collection
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
                  onMouseEnter={() => {
                    setHoveredCard(item);
                  }}
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
                        label={getQuantity(item).toString()}
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

export default Search;
