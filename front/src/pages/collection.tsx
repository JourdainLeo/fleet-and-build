import { Flex } from "@mantine/core";

import { useEffect } from "react";
import { useApi } from "../services/api";
import { useStore } from "../services/store";
import Filter from "./search/filter";
import GridCards from "./search/grid-cards";
import Pagination from "./search/pagination";

function Collection() {
  const store = useStore();
  const api = useApi();

  useEffect(() => {
    store.setLoading(true);
    api.get("/user/:id/collection", { id: 1 }).then((r) => {
      store.setCount(r.count);
      store.setCards(r.results);
      store.setLoading(false);
    });
  }, []);

  if (!store.user) return;

  return (
    <Flex h={"100%"} direction={"column"} pb={16}>
      <Filter
        fetch={(debounced) => {
          store.setLoading(true);
          api
            .get("/user/:id/collection", { id: 1 }, { q: debounced })
            .then((r) => {
              store.setCount(r.count);
              store.setCards(r.results);
              store.setLoading(false);
            });
        }}
      />
      <GridCards />
      <Pagination />
    </Flex>
  );
}

export default Collection;
