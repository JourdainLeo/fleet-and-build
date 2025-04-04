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
    const get = async () => {
      const res = await api.get("/user/:id", { id: 1 });
      store.setUser(res);
    };

    get().then(() => {
      store.setLoading(false);
    });
  }, []);

  if (!store.user) return;

  return (
    <Flex h={"100%"} direction={"column"} pb={16}>
      <Filter
        fetch={(debounced) => {
          store.setLoading(false);
          store.setCount(50);
        }}
      />
      <GridCards cards={store.user.collection} />
      <Pagination />
    </Flex>
  );
}

export default Collection;
