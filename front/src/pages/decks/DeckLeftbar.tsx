import { Divider, Flex, ScrollArea } from "@mantine/core";
import { AnimatePresence } from "framer-motion";
import { useZustore } from "../../services/zustore";
import CardBanner from "./leftbar/CardBanner";
import DeckContainer from "./leftbar/DeckContainer";
import LeftbarFooter from "./leftbar/LeftbarFooter";
import LeftbarHeader from "./leftbar/LeftbarHeader";

function DeckLeftbar({ open }: { open: () => void }) {
  const deck = useZustore((state) => state.deck);
  const decks = useZustore((state) => state.decks);
  const setDeck = useZustore((state) => state.setDeck);
  return (
    <Flex
      style={{ borderRight: "1px solid var(--mantine-color-dark-4)" }}
      className={"deck-leftbar"}
    >
      <LeftbarHeader />
      <Divider orientation={"horizontal"} w={"100%"} />
      <ScrollArea h={"100%"}>
        <Flex p={16} direction={"column"} gap={!deck ? 16 : 3}>
          <AnimatePresence>
            {!deck
              ? decks.map((deck) => (
                  <DeckContainer key={deck.id} deck={deck} hover />
                ))
              : deck.cards.map((card) => (
                  <CardBanner key={card.card_id} card={card} />
                ))}
          </AnimatePresence>
        </Flex>
      </ScrollArea>
      <Divider orientation={"horizontal"} w={"100%"} />
      <LeftbarFooter open={open} />
    </Flex>
  );
}

export default DeckLeftbar;
