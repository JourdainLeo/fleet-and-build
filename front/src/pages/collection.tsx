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
import Filter from "../components/Filter";
import { useApi } from "../services/api";
import { useZustore } from "../services/zustore";
import LoadingCards from "./search/loading-cards";

function Collection() {
  const api = useApi();
  const [opened, { open, close }] = useDisclosure(false);
  const [current, setCurrent] = useState<CollectionCard>();
  const [imageLoading, setImageLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1060px)");
  const isBigTablet = useMediaQuery("(max-width: 1390px)");
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
      </Filter>

      <Modal
        opened={opened}
        onClose={close}
        title="Card information"
        radius={16}
        centered
        size={isMobile ? "100%" : isTablet ? "100%" : "80%"}
      >
        <Flex
          h={!isMobile || !isTablet ? "80vh" : "100vh"}
          flex={1}
          direction={isMobile ? "column" : "row"}
        >
          <Flex align={"center"} justify={"center"} h={"100%"} flex={1}>
            {(!isTablet || isMobile) && (
              <Skeleton
                visible={imageLoading}
                animate
                h={isMobile ? 307 : isBigTablet ? 399 : 500}
                w={isMobile ? 220 : isBigTablet ? 286 : 358}
                radius="md"
              >
                <Image
                  src={current?.image.large}
                  fit="contain"
                  height={isMobile ? 307 : isBigTablet ? 400 : 500}
                  width={isMobile ? 220 : isBigTablet ? 286 : 358}
                  radius="md"
                  onLoad={() => setImageLoading(false)}
                  loading="lazy"
                />
              </Skeleton>
            )}
          </Flex>
          {(!isTablet || isMobile) && (
            <Divider
              orientation={isMobile ? "horizontal" : "vertical"}
              m={16}
            />
          )}
          <Flex
            direction={"column"}
            justify={"space-between"}
            w={"100%"}
            gap={16}
          >
            <Flex flex={1} direction={"column"} w={"100%"} gap={16}>
              <Flex gap={16}>
                {isTablet && !isMobile && (
                  <Skeleton
                    visible={imageLoading}
                    animate
                    h={isMobile ? 307 : isTablet ? 307 : 500}
                    w={isMobile ? 220 : isTablet ? 220 : 358}
                    radius="md"
                  >
                    <Image
                      src={current?.image.large}
                      fit="contain"
                      height={isMobile ? 307 : isTablet ? 307 : 500}
                      width={isMobile ? 220 : isTablet ? 220 : 358}
                      radius="md"
                      onLoad={() => setImageLoading(false)}
                      loading="lazy"
                    />
                  </Skeleton>
                )}
                <Flex
                  direction={"column"}
                  flex={1}
                  style={{ textAlign: isMobile ? "center" : "left" }}
                >
                  <Text fw={600} fz={32}>
                    {current?.name}
                  </Text>
                  <Text mt={-8} fz={12}>
                    Illustration:{" "}
                    {current?.artists ? current.artists[0] : "None"}
                  </Text>
                  {isTablet && current?.other.text_html && (
                    <MantineCard className={"card-text"} mt={16}>
                      <Text
                        dangerouslySetInnerHTML={{
                          __html: current?.other.text_html || "",
                        }}
                      />
                    </MantineCard>
                  )}
                </Flex>
              </Flex>
              {isTablet && !isMobile && <Divider orientation={"horizontal"} />}
              {!isTablet && current?.other.text_html && (
                <MantineCard className={"card-text"}>
                  <Text
                    dangerouslySetInnerHTML={{
                      __html: current?.other.text_html || "",
                    }}
                  />
                </MantineCard>
              )}
              <Flex direction={"column"} gap={16}>
                <Flex direction={"column"} gap={2}>
                  <Text fw={600}>Classes</Text>
                  <Flex gap={8}>
                    {current?.classes.map((c) => {
                      return <Badge>{c}</Badge>;
                    })}
                  </Flex>
                </Flex>

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
                  <Flex gap={8} wrap={"wrap"}>
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
            <MantineCard p={8}>
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
                        setCollection(json);
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
                        setCollection(json);
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
    </>
  );
}

export default Collection;
