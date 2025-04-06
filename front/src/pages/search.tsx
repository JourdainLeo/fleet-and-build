import { useEffect } from "react";
import Filter from "../components/Filter";
import { useApi } from "../services/api";
import { useZustore } from "../services/zustore";
import GridCards from "./search/grid-cards";

function Search() {
  const api = useApi();
  const setLoading = useZustore((state) => state.setLoading);
  const setCount = useZustore((state) => state.setCount);
  const setCards = useZustore((state) => state.setCards);

  useEffect(() => {
    setLoading(true);
    api.get("/cards", { id: 1 }, { limit: 50, offset: 0 }).then((r) => {
      setCount(r.count);
      setCards(r.results);
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
      <GridCards />
    </Filter>
  );
}

export default Search;
