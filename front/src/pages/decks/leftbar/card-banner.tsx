import type { CollectionCard } from "@fleet-and-build/api";
import { Box, Flex, Image, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Action } from "../../../components/Action";

function CardBanner({ card }: { card: CollectionCard }) {
  return (
    <Box
      pos="relative"
      w="100%"
      className="transition hover deck-card-container"
    >
      <Image
        src={
          card.pitch === 1
            ? "red-banner.png"
            : card.pitch === 2
              ? "yellow-banner.png"
              : "blue-banner.png"
        }
      />

      <Text size="lg" className={"fab-font deck-card-text"}>
        {card.name}
      </Text>
      <Flex className="deck-card-hover-bar">
        <Action icon={<IconMinus />} size={"lg"} />
        <Action icon={<IconPlus />} />
      </Flex>
      <Text fz="sm" className={"deck-card-quantity"}>
        {card.quantity}
      </Text>
      <Text className={"fab-font deck-card-pitch"}>{card.pitch}</Text>
    </Box>
  );
}

export default CardBanner;
