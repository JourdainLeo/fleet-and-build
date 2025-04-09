import { Divider, Flex, ScrollArea } from "@mantine/core";
import { useZustore } from "../../services/zustore";
import CardBanner from "./leftbar/CardBanner";
import DeckContainer from "./leftbar/DeckContainer";
import LeftbarFooter from "./leftbar/LeftbarFooter";
import LeftbarHeader from "./leftbar/LeftbarHeader";

function DeckLeftbar({ open }: { open: () => void }) {
  const deck = useZustore((state) => state.deck);
  const decks = useZustore((state) => state.decks);

  return (
    <Flex
      style={{ borderRight: "1px solid var(--mantine-color-dark-4)" }}
      className={"deck-leftbar"}
    >
      <LeftbarHeader />
      <Divider orientation={"horizontal"} w={"100%"} />
      <ScrollArea h={"100%"}>
        <Flex p={16} direction={"column"} gap={!deck ? 16 : 3}>
          {!deck
            ? decks.map((deck, index) => (
                <DeckContainer key={index} deck={deck} />
              ))
            : deck.cards.map((card, index) => (
                <CardBanner key={index} card={card} />
              ))}
        </Flex>
      </ScrollArea>
      <Divider orientation={"horizontal"} w={"100%"} />
      <LeftbarFooter open={open} />
    </Flex>
  );
}

export default DeckLeftbar;
