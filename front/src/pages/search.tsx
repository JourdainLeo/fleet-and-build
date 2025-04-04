import { Flex } from "@mantine/core";

import { useEffect } from "react";
import { useStore } from "../services/store";
import Filter from "./search/filter";
import GridCards from "./search/grid-cards";
import Pagination from "./search/pagination";

function Search() {
  const store = useStore();

  useEffect(() => {
    store.setLoading(true);
    store
      .fetchCards(
        "https://cards.fabtcg.com/api/search/v1/cards/?limit=50&offset=0",
      )
      .then(() => {
        store.setLoading(false);
      });
  }, []);

  return (
    <Flex h={"100%"} direction={"column"} pb={16}>
      <Filter
        fetch={(debounced) => {
          store
            .fetchCards(
              "https://cards.fabtcg.com/api/search/v1/cards/?q=" + debounced,
            )
            .then(() => {
              store.setLoading(false);
            });
        }}
      />
      <GridCards />
      <Pagination />
    </Flex>
  );
}

export default Search;
