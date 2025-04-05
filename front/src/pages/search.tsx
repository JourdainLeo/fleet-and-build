import { Flex } from "@mantine/core";

import { useEffect } from "react";
import { useApi } from "../services/api";
import { useStore } from "../services/store";
import Filter from "./search/filter";
import GridCards from "./search/grid-cards";
import Pagination from "./search/pagination";

function Search() {
  const store = useStore();
  const api = useApi();

  useEffect(() => {
    store.setLoading(true);
    api.get("/cards", { id: 1 }).then((r) => {
      store.setCount(r.count);
      store.setCards(r.results);
      store.setLoading(false);
    });
  }, []);

  return (
    <Flex h={"100%"} direction={"column"} pb={16}>
      <Filter
        fetch={(debounced) => {
          api.get("/cards", { id: 1 }, { q: debounced }).then((r) => {
            store.setCount(r.count);
            store.setCards(r.results);
            store.setLoading(false);
          });
        }}
      />
      <GridCards />
      <Pagination
        onChange={async (offset) => {
          await api
            .get(
              "/cards",
              {},
              {
                limit: 50,
                offset: offset,
                q: store.debounced,
              },
            )
            .then((r) => {
              store.setCount(r.count);
              store.setLoading(false);
              store.setCards(r.results);
            });
        }}
      />
    </Flex>
  );
}

export default Search;
