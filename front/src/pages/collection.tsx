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
import Tilt from "react-parallax-tilt";
import { Action } from "../components/Action";
import Filter from "../components/Filter";
import { useApi } from "../services/api";
import { useZustore } from "../services/zustore";
import RarityBadge from "./collection/rarity-badge";
import LoadingCards from "./search/loading-cards";

function Collection() {
  const api = useApi();
  const [opened, { open, close }] = useDisclosure(false);
  const [current, setCurrent] = useState<CollectionCard>();
  const [imageLoading, setImageLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1400px)");
  const setLoading = useZustore((state) => state.setLoading);
  const setCollection = useZustore((state) => state.setCollection);
  const setCount = useZustore((state) => state.setCount);
  const grid = useZustore((state) => state.grid);
  const collection = useZustore((state) => state.collection);
  const loading = useZustore((state) => state.loading);

  /*
  const cardWithMaxClasses = cards.reduce((maxCard, currentCard) => {
    return currentCard.sets.length > maxCard.sets.length
      ? currentCard
      : maxCard;
  }, cards[0]);

  console.log(cardWithMaxClasses);
*/

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

  console.log(isTablet);
  console.log("m", isMobile);

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
        size={"100%"}
      >
        <Flex
          h={isMobile ? "100vh" : isTablet ? "70vh" : "57vh"}
          flex={1}
          direction={isMobile ? "column" : "row"}
        >
          <Flex justify={"center"} h={"100%"} flex={1}>
            {(!isTablet || isMobile) && (
              <Skeleton
                visible={imageLoading}
                animate
                h={500}
                w={358}
                radius="md"
                mt={16}
              >
                <Tilt
                  glareEnable={true}
                  glareMaxOpacity={0.2}
                  glareColor="#ffffff"
                  glarePosition="all"
                  glareBorderRadius={"20px"}
                  scale={1}
                  transitionSpeed={200}
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  className="cursor"
                >
                  <Image
                    src={current?.image.large}
                    fit="contain"
                    height={500}
                    width={358}
                    radius="md"
                    onLoad={() => setImageLoading(false)}
                    loading="lazy"
                  />
                </Tilt>
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
                    h={500}
                    w={358}
                    radius="md"
                  >
                    <Tilt
                      glareEnable={true}
                      glareMaxOpacity={0.2}
                      glareColor="#ffffff"
                      glarePosition="all"
                      glareBorderRadius={"20px"}
                      scale={1}
                      transitionSpeed={200}
                      tiltMaxAngleX={10}
                      tiltMaxAngleY={10}
                      className="cursor"
                    >
                      <Image
                        src={current?.image.large}
                        fit="contain"
                        h={500}
                        w={358}
                        radius="md"
                        onLoad={() => setImageLoading(false)}
                        loading="lazy"
                      />
                    </Tilt>
                  </Skeleton>
                )}
                <Flex
                  direction={"column"}
                  flex={1}
                  align={isMobile ? "center" : "flex-start"}
                >
                  <Flex
                    justify={!isMobile ? "space-between" : "center"}
                    w={"100%"}
                    direction={isMobile ? "column" : "row"}
                    gap={16}
                  >
                    <Flex
                      gap={isTablet ? 0 : 16}
                      direction={isTablet ? "column" : "row"}
                      align={isMobile || !isTablet ? "center" : "flex-start"}
                    >
                      <Text fw={600} fz={isTablet ? 24 : 32}>
                        {current?.name}
                      </Text>
                      {isTablet && (
                        <Text mt={-8} fz={12}>
                          Art: {current?.artists ? current.artists[0] : "None"}
                        </Text>
                      )}
                      <Flex gap={8} mt={isTablet ? 8 : 0}>
                        {current?.rarities.map((r) => (
                          <RarityBadge r={r} key={r} />
                        ))}
                      </Flex>
                    </Flex>
                    <Flex align={"flex-start"} justify={"center"}>
                      <MantineCard p={8}>
                        <Flex gap={24} align={"center"} justify={"center"}>
                          <Action
                            icon={<IconMinus />}
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
                                    json.find(
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
                  {!isTablet && (
                    <Text mt={-8} fz={12}>
                      Art: {current?.artists ? current.artists[0] : "None"}
                    </Text>
                  )}
                  {isTablet && !isMobile && (
                    <Flex gap={16} direction={"column"} flex={1} mt={16}>
                      <MantineCard
                        className={"card-text"}
                        pt={8}
                        pb={8}
                        flex={2}
                      >
                        <Text
                          dangerouslySetInnerHTML={{
                            __html: current?.other.text_html || "",
                          }}
                        />
                      </MantineCard>
                      <MantineCard className={"card-text"} flex={1}>
                        <Text>Printing</Text>
                        <Text>Printing</Text>
                        <Text>Printing</Text>
                      </MantineCard>
                    </Flex>
                  )}
                </Flex>
              </Flex>
              {isMobile ||
                (!isTablet && (
                  <Flex
                    gap={16}
                    direction={isMobile || isTablet ? "column" : "row"}
                    flex={1}
                  >
                    <MantineCard className={"card-text"} pt={8} pb={8} flex={1}>
                      <Text
                        dangerouslySetInnerHTML={{
                          __html: current?.other.text_html || "",
                        }}
                      />
                    </MantineCard>
                    <MantineCard className={"card-text"} flex={1}>
                      <Text>Printing</Text>
                      <Text>Printing</Text>
                      <Text>Printing</Text>
                    </MantineCard>
                  </Flex>
                ))}

              <Flex direction={"column"} gap={16} flex={1}>
                <Flex
                  gap={isMobile ? 8 : 16}
                  align={isMobile ? "flex-start" : "center"}
                  direction={isMobile ? "column" : "row"}
                  wrap={"wrap"}
                >
                  <Flex direction={"column"} gap={2}>
                    <Text fw={600} fz={12}>
                      Class
                      {current?.classes.length && current?.classes.length > 1
                        ? "es"
                        : ""}
                    </Text>
                    <Flex gap={8} wrap={"wrap"}>
                      {current?.classes.map((c) => {
                        return <Badge>{c}</Badge>;
                      })}
                    </Flex>
                  </Flex>
                  <Divider orientation={"vertical"} />
                  <Flex direction={"column"} gap={2}>
                    <Text fw={600} fz={12}>
                      Type
                      {current?.types.length && current?.types.length > 1
                        ? "s"
                        : ""}{" "}
                    </Text>
                    <Flex gap={8} wrap={"wrap"}>
                      {current?.types.map((r) => {
                        return <Badge key={r}>{r}</Badge>;
                      })}
                    </Flex>
                  </Flex>
                  <Divider orientation={"vertical"} />
                  <Flex direction={"column"} gap={2}>
                    <Text fw={600} fz={12}>
                      Set
                      {current?.sets.length && current?.sets.length > 1
                        ? "s"
                        : ""}
                    </Text>
                    <Flex gap={8} wrap={"wrap"}>
                      {current?.sets.map((r) => {
                        return <Badge key={r}>{r}</Badge>;
                      })}
                    </Flex>
                  </Flex>
                </Flex>
                <Flex direction={"column"} gap={2}>
                  <Text fw={600} fz={12}>
                    Legal Heroes
                  </Text>
                  <Flex gap={8} wrap={"wrap"}>
                    {current?.legalHeroes.map((r) => {
                      return <Badge key={r}>{r}</Badge>;
                    })}
                  </Flex>
                </Flex>

                <Flex direction={"column"} gap={2} pb={16}>
                  <Text fw={600} fz={12}>
                    Legal Formats
                  </Text>
                  <Flex wrap={"wrap"} gap={8}>
                    {current?.legalFormats.map((r) => {
                      return <Badge>{r}</Badge>;
                    })}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}

export default Collection;
