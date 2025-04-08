import type { CollectionCard } from "@fleet-and-build/api";
import { Grid, Image, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Filter from "../components/Filter";
import { useApi } from "../services/api";
import { useZustore } from "../services/zustore";
import Details from "./collection/details";
import LoadingCards from "./search/loading-cards";

function Collection() {
  const api = useApi();
  const [opened, { open, close }] = useDisclosure(false);
  const [current, setCurrent] = useState<CollectionCard>();
  const [imageLoading, setImageLoading] = useState(false);
  const setLoading = useZustore((state) => state.setLoading);
  const setCollection = useZustore((state) => state.setCollection);
  const setCount = useZustore((state) => state.setCount);
  const grid = useZustore((state) => state.grid);
  const collection = useZustore((state) => state.collection);
  const loading = useZustore((state) => state.loading);

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
        <ScrollArea h={"100%"} mr={32} ml={32}>
          <Grid gutter={16} align={"stretch"} p={16}>
            {!loading ? (
              collection.map((item) => (
                <Grid.Col
                  key={item.card_id}
                  span={grid}
                  className={"collection-card"}
                  onClick={() => {
                    open();
                    setCurrent(item);
                    setImageLoading(true);
                  }}
                >
                  <Image
                    src={item.image.normal}
                    fit="contain"
                    loading={"lazy"}
                  />
                </Grid.Col>
              ))
            ) : (
              <LoadingCards />
            )}
          </Grid>
        </ScrollArea>
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
