import { Flex, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { Action } from "../components/Action";
import CardGrid from "../components/CardGrid";
import Filter from "../components/Filter";
import { useApi } from "../services/api";
import { useZustore } from "../services/zustore";

function Search() {
  const api = useApi();
  const setLoading = useZustore((state) => state.setLoading);
  const setCount = useZustore((state) => state.setCount);
  const setCards = useZustore((state) => state.setCards);
  const collection = useZustore((state) => state.collection);
  const cards = useZustore((state) => state.cards);
  const setCollection = useZustore((state) => state.setCollection);

  useEffect(() => {
    setLoading(true);
    api.get("/cards", { id: 1 }, { limit: 50, offset: 0 }).then((r) => {
      setCount(r.count);
      setCards(r.results);
    });
    api
      .get("/user/:id/collection", { id: 1 }, { limit: 10000, offset: 0 })
      .then((r) => {
        setCollection(r.results);
        setLoading(false);
      });
  }, []);

  return (
    <Filter
      fetch={(query) => {
        api.get("/cards", { id: 1 }, query).then((r) => {
          setCount(r.count);
          setCards(r.results);
          setLoading(false);
        });
      }}
    >
      <CardGrid
        items={cards}
        render={(item) => {
          return (
            <Flex className="hover-bar" gap={16}>
              <Action
                disabled={
                  !collection.find((c) => c.card_id === item.card_id)?.quantity
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
                      setCollection(json);
                    },
                  );
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
                onClick={async ({ api }) => {
                  await api.put(
                    "/user/:id/collection",
                    { card_id: item.card_id },
                    {
                      id: 1,
                    },
                    (json) => {
                      setCollection(json);
                    },
                  );
                }}
              />
            </Flex>
          );
        }}
      ></CardGrid>
    </Filter>
  );
}

export default Search;
