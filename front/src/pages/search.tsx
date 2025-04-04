import type { Card } from "@fleet-and-build/api";
import {
  ActionIcon,
  Card as CardComponent,
  Checkbox,
  Flex,
  Grid,
  Image,
  Pagination,
  ScrollArea,
  Skeleton,
  Text,
  TextInput,
} from "@mantine/core";

import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconMinus, IconPlus, IconSquare } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Action } from "../components/Action";
import { useStore } from "../services/store";

function Search() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [next, setNext] = useState<string>(
    "https://cards.fabtcg.com/api/search/v1/cards/?limit=50&offset=0",
  );
  const [debounced] = useDebouncedValue(query, 200);

  const baseUrl = "https://cards.fabtcg.com/api/search/v1/cards/";
  const store = useStore();
  const [activePage, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  console.log(next);

  const [grid, setGrid] = useState({
    lg: 1.714,
    sm: 3,
    xs: 4,
    md: 3,
  });

  const getUrl = (
    page: number,
    totalPages: number,
    baseUrl: string,
    limit: number = 50,
  ): string => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    const offset = (safePage - 1) * limit;

    const url = new URL(baseUrl);
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("offset", offset.toString());

    return url.toString();
  };

  const [loading, setLoading] = useState(false);

  const fetchCards = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("failed to load cards");

    const data = await response.json();
    setCards(data.results);
    setNext(data.next);
    setTotalPages(data.count);
    console.log(data.count);
  };

  useEffect(() => {
    fetchCards(
      "https://cards.fabtcg.com/api/search/v1/cards/?limit=50&offset=0",
    ).then();
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

  useEffect(() => {
    fetchCards(
      "https://cards.fabtcg.com/api/search/v1/cards/?q=" + debounced,
    ).then();
  }, [debounced]);

  return (
    <Flex flex={1} h={"100%"} direction={"column"}>
      <CardComponent style={{ borderRadius: 16 }} p={8} withBorder>
        <Flex mb={8}>
          <TextInput
            radius={16}
            w={"100%"}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="Search for a card..."
          />
        </Flex>
        <Flex align={"center"} justify={"space-between"}>
          <Flex gap={8}>
            <Checkbox label={"Test"}></Checkbox>
            <Checkbox label={"Test"}></Checkbox>
            <Checkbox label={"Test"}></Checkbox>
          </Flex>
          <Flex justify="center" mb={8}>
            <ActionIcon variant={"subtle"}>
              <IconSquare
                size={18}
                onClick={() => {
                  setGrid({
                    lg: 1.5,
                    sm: 3,
                    xs: 4,
                    md: 3,
                  });
                }}
              />
            </ActionIcon>
            <ActionIcon
              variant={"subtle"}
              onClick={() => {
                setGrid({
                  lg: 2,
                  sm: 3,
                  xs: 4,
                  md: 3,
                });
              }}
            >
              <Flex direction={"column"} align="center" justify={"center"}>
                {Array.from({ length: 2 }).map((_, rowIndex) => (
                  <Flex key={rowIndex} align="center" justify={"center"}>
                    {Array.from({ length: 2 }).map((_, colIndex) => (
                      <IconSquare key={colIndex} size={9} />
                    ))}
                  </Flex>
                ))}
              </Flex>
            </ActionIcon>

            <ActionIcon
              variant={"subtle"}
              onClick={() => {
                setGrid({
                  lg: 2.4,
                  sm: 3,
                  xs: 4,
                  md: 3,
                });
              }}
            >
              <Flex direction={"column"} align="center" justify={"center"}>
                {Array.from({ length: 3 }).map((_, rowIndex) => (
                  <Flex key={rowIndex} align="center" justify={"center"}>
                    {Array.from({ length: 3 }).map((_, colIndex) => (
                      <IconSquare key={colIndex} size={6} />
                    ))}
                  </Flex>
                ))}
              </Flex>
            </ActionIcon>
          </Flex>
        </Flex>
      </CardComponent>
      <ScrollArea
        flex={1}
        style={{ backgroundColor: "#6f0000" }}
        mr={32}
        ml={32}
      >
        <Grid gutter={16} align={"stretch"} h={"77vh"} flex={1} p={16}>
          {cards.map((item) => (
            <Grid.Col key={item.card_id} span={grid} className="card-container">
              <Flex className="card">
                <Skeleton visible={loading} animate>
                  <Image
                    src={item.image.normal}
                    fit="contain"
                    className="card-image fade-in"
                    loading={"lazy"}
                  />
                </Skeleton>

                <Flex className="hover-bar" gap={16}>
                  <Action
                    className="card-button"
                    icon={<IconMinus />}
                    onClick={async ({ api, store }) => {
                      try {
                        const user = await api.delete(
                          "/user/:id/collection/:card_id",
                          { id: 1, card_id: item.card_id },
                        );

                        store.setUser(user);

                        notifications.show({
                          message: "Card removed!",
                          color: "green",
                          position: "top-right",
                        });
                      } catch (error) {
                        notifications.show({
                          message: "Error removing card: " + error,
                          color: "red",
                          position: "top-right",
                        });
                      }
                    }}
                  />
                  <Text fw={900} size={"20"}>
                    {getQuantity(item).toString()}
                  </Text>
                  <Action
                    className="card-button"
                    icon={<IconPlus />}
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
                          message: "Error adding card " + error,
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
      <Flex align={"center"} justify={"center"} mt={16} gap={16}>
        <Pagination
          total={totalPages / 50}
          value={activePage}
          onChange={async (value) => {
            setLoading(true);
            setPage(value);
            const url = getUrl(value, totalPages / 50, baseUrl);
            console.log(url);
            fetchCards(url).then(() => {
              setLoading(false);
            });
          }}
          withEdges
          size="md"
          radius="xl"
          siblings={1}
          boundaries={1}
        />
      </Flex>
    </Flex>
  );
}

export default Search;
