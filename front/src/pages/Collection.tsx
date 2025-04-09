import type { CollectionCard } from "@fleet-and-build/api";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import CardGrid from "../components/CardGrid";
import Filter from "../components/Filter";
import { useApi } from "../services/api";
import { useZustore } from "../services/zustore";
import Details from "./collection/Details";

function Collection() {
  const api = useApi();
  const [opened, { open, close }] = useDisclosure(false);
  const [current, setCurrent] = useState<CollectionCard>();
  const [imageLoading, setImageLoading] = useState(false);
  const setLoading = useZustore((state) => state.setLoading);
  const setCollection = useZustore((state) => state.setCollection);
  const setCount = useZustore((state) => state.setCount);
  const collection = useZustore((state) => state.collection);

  useEffect(() => {
    setLoading(true);
    api
      .get("/user/:id/collection", { id: 1 }, { limit: 50, offset: 0 })
      .then((r) => {
        setCount(r.count);
        setCollection(r.results);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Filter
        fetch={(query) => {
          api.get("/user/:id/collection", { id: 1 }, query).then((r) => {
            setCount(r.count);
            setCollection(r.results);
            setLoading(false);
          });
        }}
      >
        <CardGrid
          items={collection}
          hover
          onClick={(item) => {
            open();
            setCurrent(item);
            setImageLoading(true);
          }}
        />
        <Details
          current={current}
          opened={opened}
          close={close}
          imageLoading={imageLoading}
          setImageLoading={setImageLoading}
          setCurrent={setCurrent}
        />
      </Filter>
    </>
  );
}

export default Collection;
