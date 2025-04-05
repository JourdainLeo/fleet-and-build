import { Flex } from "@mantine/core";
import { useEffect } from "react";
import { useApi } from "../services/api";
import { useZustore } from "../services/zustore";
import Filter from "./search/filter";
import GridCards from "./search/grid-cards";
import Pagination from "./search/pagination";

function Search() {
  const api = useApi();
  const setLoading = useZustore((state) => state.setLoading);
  const setCount = useZustore((state) => state.setCount);
  const setCards = useZustore((state) => state.setCards);
  const q = useZustore((state) => state.q);

  useEffect(() => {
    setLoading(true);
    api.get("/cards", { id: 1 }).then((r) => {
      setCount(r.count);
      setCards(r.results);
      setLoading(false);
    });
  }, []);

  return (
    <Flex h={"100%"} direction={"column"} pb={16}>
      <Filter
        fetch={(debounced) => {
          api.get("/cards", { id: 1 }, { q: debounced }).then((r) => {
            setCount(r.count);
            setCards(r.results);
            setLoading(false);
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
                q: q,
              },
            )
            .then((r) => {
              setCount(r.count);
              setLoading(false);
              setCards(r.results);
            });
        }}
      />
    </Flex>
  );
}

export default Search;
