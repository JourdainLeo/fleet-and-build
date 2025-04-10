import type { CollectionCard } from "@fleet-and-build/api";
import { Box, Image, Text } from "@mantine/core";
import { motion } from "framer-motion";

function CardBanner({ card }: { card: CollectionCard }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Box pos="relative" w="100%" className="cursor deck-card-container">
        <Image
          src={
            card.pitch === 1
              ? "red-banner.png"
              : card.pitch === 2
                ? "yellow-banner.png"
                : "blue-banner.png"
          }
        />

        <Text fz="sm" className="deck-card-quantity">
          <button
            className="quantity-btn"
            onClick={(e) => {
              e.stopPropagation();
              // remove
            }}
          >
            -
          </button>
          {card.quantity}
          <button
            className="quantity-btn"
            onClick={(e) => {
              e.stopPropagation();
              // add
            }}
          >
            +
          </button>
        </Text>
        <Text
          size="lg"
          className={"fab-font deck-card-text"}
          c={"black"}
          fz={card.name.length && card.name.length > 20 ? 12 : 18}
        >
          {card.name}
        </Text>
        <Text className={"fab-font deck-card-pitch"}>{card.pitch}</Text>
      </Box>
    </motion.div>
  );
}

export default CardBanner;
