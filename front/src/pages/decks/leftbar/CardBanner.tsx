import type { CollectionCard, DeckApi } from "@fleet-and-build/api";
import { Box, Image, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Action } from "../../../components/Action";
import { useZustore } from "../../../services/zustore";

function CardBanner({ card }: { card: CollectionCard }) {
  const setDeck = useZustore((state) => state.setDeck);
  const deck = useZustore((state) => state.deck);
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
                : card.pitch === 3
                  ? "blue-banner.png"
                  : "equipment-banner.png"
          }
        />

        <Text
          fz="sm"
          className="deck-card-quantity"
          style={typeof card.pitch !== "number" ? { top: 9 } : {}}
        >
          <Action
            className={"quantity-btn"}
            variant={"subtle"}
            icon={<IconMinus size={12} color={"white"} />}
            onClick={() => {
              const newDeck = {
                ...deck,
                cards: deck?.cards.reduce((acc, c) => {
                  if (c.card_id === card.card_id) {
                    const newQuantity = c.quantity - 1;
                    if (newQuantity > 0) {
                      acc.push({ ...c, quantity: newQuantity });
                    }
                  } else {
                    acc.push(c);
                  }
                  return acc;
                }, [] as CollectionCard[]),
              };

              setDeck(newDeck as DeckApi);
            }}
            size={"xs"}
          />
          {card.quantity}
          <Action
            className={"quantity-btn"}
            variant={"subtle"}
            icon={<IconPlus size={12} color={"white"} />}
            size={"xs"}
            onClick={() => {
              const newDeck = {
                ...deck,
                cards: (() => {
                  let found = false;

                  const updatedCards = deck?.cards.reduce(
                    (acc, c) => {
                      if (c.card_id === card.card_id) {
                        found = true;
                        acc.push({
                          ...c,
                          quantity: c.quantity + 1,
                        });
                      } else {
                        acc.push(c);
                      }
                      return acc;
                    },
                    [] as typeof deck.cards,
                  );

                  if (!found && updatedCards) {
                    updatedCards.push({
                      ...card,
                      quantity: 1,
                    } as CollectionCard);
                  }

                  return updatedCards;
                })(),
              };

              setDeck(newDeck as DeckApi);
            }}
          />
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
