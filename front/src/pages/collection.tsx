import {
  Divider,
  Flex,
  Grid,
  Image,
  Card as MantineCard,
  Modal,
  ScrollArea,
  Skeleton,
  Text,
} from "@mantine/core";

import type { Card } from "@fleet-and-build/api";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useApi } from "../services/api";
import { useStore } from "../services/store";
import Filter from "./search/filter";
import LoadingCards from "./search/loading-cards";
import Pagination from "./search/pagination";

function Collection() {
  const store = useStore();
  const api = useApi();
  const [opened, { open, close }] = useDisclosure(false);
  const [current, setCurrent] = useState<Card>();
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    store.setLoading(true);
    api.get("/user/:id/collection", { id: 1 }).then((r) => {
      store.setCount(r.count);
      store.setCards(r.results);
      store.setLoading(false);
    });
  }, []);

  if (!store.user) return;

  console.log(current?.text_html);
  return (
    <Flex h={"100%"} direction={"column"} pb={16}>
      <Filter
        fetch={(debounced) => {
          api
            .get("/user/:id/collection", { id: 1 }, { q: debounced })
            .then((r) => {
              store.setCount(r.count);
              store.setCards(r.results);
              store.setLoading(false);
            });
        }}
      />

      <ScrollArea h={"100%"} mr={32} ml={32}>
        <Grid gutter={16} align={"stretch"} p={16}>
          {!store.loading ? (
            store.cards.map((item) => (
              <Grid.Col
                key={item.card_id}
                span={store.grid}
                className={"collection-card"}
                onClick={() => {
                  open();
                  setCurrent(item);
                  setImageLoading(true);
                }}
              >
                <Image src={item.image.normal} fit="contain" loading={"lazy"} />
              </Grid.Col>
            ))
          ) : (
            <LoadingCards />
          )}
        </Grid>
      </ScrollArea>

      <Pagination />

      <Modal
        opened={opened}
        onClose={close}
        title="Card information"
        centered
        h={"100%"}
        flex={1}
        size={"xl"}
      >
        <Flex h={"100%"} flex={1}>
          <Skeleton visible={imageLoading} animate radius={16} h={500} w={358}>
            <Image
              h={500}
              src={current?.image.large}
              fit="contain"
              onLoad={() => {
                setImageLoading(false);
              }}
              loading={"lazy"}
            />
          </Skeleton>
          <Divider orientation={"vertical"} m={16} />
          <Flex flex={1} direction={"column"} gap={16}>
            <Flex direction={"column"}>
              <Text fw={600} fz={32}>
                {current?.name}
              </Text>
              <Text>Quantity: {current?.quantity}</Text>
            </Flex>
            <MantineCard className={"card-text"}>
              <Text
                dangerouslySetInnerHTML={{ __html: current?.text_html || "" }}
              />
            </MantineCard>
          </Flex>
        </Flex>
      </Modal>
    </Flex>
  );
}

export default Collection;
