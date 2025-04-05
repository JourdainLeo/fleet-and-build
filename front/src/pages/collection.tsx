import type { Card } from "@fleet-and-build/api";
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
import { useDisclosure } from "@mantine/hooks";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Action } from "../components/Action";
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
        size={"60%"}
        radius={16}
      >
        <Flex h={"100%"} flex={1}>
          <Flex align={"center"}>
            <Skeleton
              visible={imageLoading}
              animate
              radius={16}
              h={500}
              w={358}
            >
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
          </Flex>
          <Divider orientation={"vertical"} m={16} />
          <Flex direction={"column"} justify={"space-between"} w={"100%"}>
            <Flex flex={1} direction={"column"} gap={16} w={"100%"}>
              <Flex direction={"column"}>
                <Text fw={600} fz={32}>
                  {current?.name}
                </Text>
                <Text mt={-8} fz={12}>
                  Illustration: {current?.artists ? current.artists[0] : "None"}
                </Text>
              </Flex>
              {current?.text_html && (
                <MantineCard className={"card-text"} radius={16}>
                  <Text
                    dangerouslySetInnerHTML={{
                      __html: current?.text_html || "",
                    }}
                  />
                </MantineCard>
              )}
              <Flex direction={"column"}>
                <Text>Class: {current?.quantity}</Text>
                <Text>Type: {current?.quantity}</Text>
                <Text>Action: {current?.quantity}</Text>
                <Text>Rarities: {current?.quantity}</Text>
                <Text>Artist: {current?.quantity}</Text>
                <Text>Set: {current?.quantity}</Text>
              </Flex>
            </Flex>
            <MantineCard p={8} radius={16}>
              <Flex gap={32} align={"center"} justify={"center"}>
                <Action
                  icon={<IconMinus />}
                  label={"Remove"}
                  onClick={async ({ api }) => {
                    if (!current) return;
                    await api.delete(
                      "/user/:id/collection/:card_id",
                      {
                        id: 1,
                        card_id: current.card_id,
                      },
                      (json) => {
                        store.setUser(json);
                        store.setCards(json.collection);
                        const c = json.collection.find(
                          (c) => c.card_id === current.card_id,
                        );

                        if (!c) {
                          close();
                        } else {
                          setCurrent(c);
                        }
                      },
                    );
                  }}
                />
                <Text fw={600}>{current?.quantity}</Text>
                <Action
                  icon={<IconPlus />}
                  label={"Add"}
                  onClick={async ({ api }) => {
                    if (!current) return;
                    await api.put(
                      "/user/:id/collection",
                      current,
                      {
                        id: 1,
                      },
                      (json) => {
                        store.setUser(json);
                        store.setCards(json.collection);
                        setCurrent(
                          json.collection.find(
                            (c) => c.card_id === current.card_id,
                          ),
                        );
                      },
                    );
                  }}
                />
              </Flex>
            </MantineCard>
          </Flex>
        </Flex>
      </Modal>
    </Flex>
  );
}

export default Collection;
