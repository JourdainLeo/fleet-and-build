import type { CollectionCard } from "@fleet-and-build/api";
import {
  Badge,
  Divider,
  Flex,
  Card as MantineCard,
  Modal,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Action } from "../../components/Action";
import { useZustore } from "../../services/zustore";
import RarityBadge from "./rarity-badge";
import TiltCard from "./tilt-card";

function Details({
  current,
  opened,
  imageLoading,
  setImageLoading,
  setCurrent,
  close,
}: DetailsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const mobileOrTablet = useMediaQuery("(max-width: 1400px)");
  const setCollection = useZustore((state) => state.setCollection);
  const isTablet = mobileOrTablet && !isMobile;
  const mobileOrDesktop = isMobile || !mobileOrTablet;
  const direction = isMobile ? "column" : "row";

  if (!current) return;

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Card information"
      radius={16}
      centered
      size={"100%"}
    >
      <Flex flex={1} direction={direction}>
        {mobileOrDesktop && (
          <Flex justify={"center"} h={"100%"} flex={1}>
            <TiltCard
              url={current.image.normal}
              imageLoading={imageLoading}
              setImageLoading={setImageLoading}
            />
          </Flex>
        )}
        {mobileOrDesktop && (
          <Divider orientation={isMobile ? "horizontal" : "vertical"} m={16} />
        )}
        <Flex direction="column" justify="space-between" w="100%" gap={16}>
          <Flex gap={16}>
            {isTablet && (
              <TiltCard
                url={current.image.normal}
                imageLoading={imageLoading}
                setImageLoading={setImageLoading}
              />
            )}
            <Flex
              direction={"column"}
              flex={1}
              align={isMobile ? "center" : "flex-start"}
            >
              <Flex
                justify={!isMobile ? "space-between" : "center"}
                w={"100%"}
                direction={direction}
                gap={16}
              >
                <Flex
                  gap={mobileOrTablet ? 0 : 16}
                  direction={mobileOrTablet ? "column" : "row"}
                  align={mobileOrDesktop ? "center" : "flex-start"}
                >
                  <Text fw={600} fz={mobileOrTablet ? 24 : 32}>
                    {current.name}
                  </Text>
                  {mobileOrTablet && (
                    <Text mt={-8} fz={12}>
                      Art: {current.artists ? current.artists[0] : "None"}
                    </Text>
                  )}
                  <Flex gap={8} mt={mobileOrTablet ? 8 : 0}>
                    {current.rarities.map((r) => (
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
                      <Text fw={600}>{current.quantity}</Text>
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
              {!mobileOrTablet && (
                <Text mt={-8} fz={12}>
                  Art: {current.artists ? current.artists[0] : "None"}
                </Text>
              )}
              {isTablet && (
                <TextPrinting
                  direction={direction}
                  text={current.other.text_html}
                />
              )}
            </Flex>
          </Flex>
          {mobileOrDesktop && (
            <TextPrinting
              direction={direction}
              text={current.other.text_html}
            />
          )}
          <Flex direction={"column"} gap={16} flex={1}>
            <Flex
              gap={isMobile ? 8 : 16}
              align={isMobile ? "flex-start" : "center"}
              wrap={"wrap"}
            >
              <BadgeGroup label={"Class"} items={current.classes} />
              <Divider orientation={"vertical"} />
              <BadgeGroup label={"Type"} items={current.types} />
              <Divider orientation={"vertical"} />
              <BadgeGroup label={"Set"} items={current.sets} />
            </Flex>
            <BadgeGroup label={"Heroes"} items={current.legalHeroes} />
            <BadgeGroup label={"Formats"} items={current.legalFormats} />
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  );
}

const BadgeGroup = ({
  label,
  items = [],
}: {
  label: string;
  items?: string[];
}) => {
  if (!items.length) return null;
  return (
    <Flex direction="column" gap={2}>
      <Text fw={600} fz={12}>
        {label}
      </Text>
      <Flex gap={8} wrap="wrap">
        {items.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </Flex>
    </Flex>
  );
};

const TextPrinting = ({
  direction,
  text,
}: {
  direction: "row" | "column";
  text?: string;
}) => {
  return (
    <Flex gap={16} direction={direction}>
      <MantineCard className={"card-text"} pt={8} pb={8} flex={1}>
        <Text
          dangerouslySetInnerHTML={{
            __html: text || "",
          }}
        />
      </MantineCard>
      <MantineCard className={"card-text"} flex={1} />
    </Flex>
  );
};

type DetailsProps = {
  current?: CollectionCard;
  opened: boolean;
  imageLoading: boolean;
  setImageLoading: (loading: boolean) => void;
  setCurrent: (loading: CollectionCard | undefined) => void;
  close: () => void;
};

export default Details;
