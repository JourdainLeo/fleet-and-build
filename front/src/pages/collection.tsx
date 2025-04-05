import type { CollectionCard } from "@fleet-and-build/api";
import {
  Badge,
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
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
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
  const [current, setCurrent] = useState<CollectionCard>();
  const [imageLoading, setImageLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1040px)");

  useEffect(() => {
    store.setLoading(true);
    api.get("/user/:id/collection", { id: 1 }).then((r) => {
      store.setCount(r.count);
      store.setCollection(r.results);
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
              store.setCollection(r.results);
              store.setLoading(false);
            });
        }}
      />

      <ScrollArea h={"100%"} mr={32} ml={32}>
        <Grid gutter={16} align={"stretch"} p={16}>
          {!store.loading ? (
            store.collection.map((item) => (
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

      <Pagination
        onChange={async (offset) => {
          await api
            .get(
              "/user/:id/collection",
              {
                id: 1,
              },
              {
                limit: 50,
                offset: offset,
                q: store.debounced,
              },
            )
            .then((r) => {
              store.setCount(r.count);
              store.setLoading(false);
              store.setCollection(r.results);
            });
        }}
      />

      <Modal
        opened={opened}
        onClose={close}
        title="Card information"
        centered
        size={isMobile ? "100%" : isTablet ? "100%" : "80%"}
        radius={16}
      >
        <Flex
          h={!isMobile || !isTablet ? "70vh" : "75vh"}
          flex={1}
          direction={isMobile ? "column" : "row"}
        >
          <Flex align={"center"} justify={"center"} h={"100%"} flex={1}>
            <Skeleton
              visible={imageLoading}
              animate
              radius={16}
              h={isMobile ? 307 : isTablet ? 391 : 500}
              w={isMobile ? 220 : isTablet ? 220 : 358}
            >
              <Image
                src={current?.image.large}
                fit="contain"
                h={"100%"}
                onLoad={() => {
                  setImageLoading(false);
                }}
                loading={"lazy"}
              />
            </Skeleton>
          </Flex>
          <Divider orientation={isMobile ? "horizontal" : "vertical"} m={16} />
          <Flex direction={"column"} justify={"space-between"} w={"100%"}>
            <Flex flex={1} direction={"column"} gap={16} w={"100%"}>
              <Flex direction={"column"}>
                <Flex justify={"space-between"} align={"center"}>
                  <Text fw={600} fz={32}>
                    {current?.name}
                  </Text>
                  <Flex gap={8}>
                    {current?.classes.map((c) => {
                      return <Badge>{c}</Badge>;
                    })}
                  </Flex>
                </Flex>
                <Text mt={-8} fz={12}>
                  Illustration: {current?.artists ? current.artists[0] : "None"}
                </Text>
              </Flex>
              {current?.other.text_html && (
                <MantineCard className={"card-text"} radius={16}>
                  <Text
                    dangerouslySetInnerHTML={{
                      __html: current?.other.text_html || "",
                    }}
                  />
                </MantineCard>
              )}
              <Flex direction={"column"} gap={16}>
                <Flex direction={"column"} gap={2}>
                  <Text fw={600}>Types</Text>
                  <Flex gap={8}>
                    {current?.types.map((r) => {
                      return <Badge key={r}>{r}</Badge>;
                    })}
                  </Flex>
                </Flex>
                <Flex direction={"column"} gap={2}>
                  <Text fw={600}>Sets</Text>
                  <Flex gap={8}>
                    {current?.sets.map((r) => {
                      return <Badge key={r}>{r}</Badge>;
                    })}
                  </Flex>
                </Flex>
                <Flex direction={"column"} gap={2}>
                  <Text fw={600}>Rarities</Text>
                  <Flex gap={8}>
                    {current?.rarities.map((r) => {
                      return (
                        <Badge
                          key={r}
                          variant="outline"
                          color={
                            r === "Common"
                              ? "gray"
                              : r === "Rare"
                                ? "blue"
                                : r === "Majestic"
                                  ? "violet"
                                  : r === "Legendary"
                                    ? "yellow"
                                    : r === "Fabled"
                                      ? "red"
                                      : ""
                          }
                        >
                          {r}
                        </Badge>
                      );
                    })}
                  </Flex>
                </Flex>
                <Flex direction={"column"} gap={2}>
                  <Text fw={600}>Legal Heroes</Text>
                  <Flex gap={8}>
                    {current?.legalHeroes.map((r) => {
                      return <Badge key={r}>{r}</Badge>;
                    })}
                  </Flex>
                </Flex>
                <Flex direction={"column"} gap={2}>
                  <Text fw={600}>Legal Formats</Text>
                  <Flex wrap={"wrap"} gap={8}>
                    {current?.legalFormats.map((r) => {
                      return <Badge>{r}</Badge>;
                    })}
                  </Flex>
                </Flex>
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
                        store.setCollection(json);
                        const c = json.find(
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
                      { card_id: current.card_id },
                      {
                        id: 1,
                      },
                      (json) => {
                        store.setCollection(json);
                        setCurrent(
                          json.find((c) => c.card_id === current.card_id),
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
