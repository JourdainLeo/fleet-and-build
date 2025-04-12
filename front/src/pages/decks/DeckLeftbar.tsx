import type { CollectionCard } from "@fleet-and-build/api";
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

  const isType = (card: any, type: string) => card.types?.includes(type);

  const renderCardGroup = (cards: CollectionCard[], label: string) => {
    if (cards.length === 0) return null;

    const displayLabel = `${label} (${cards.length})`;

    return (
      <>
        <Divider label={displayLabel} labelPosition="center" my={8} />
        {cards.map((card) => (
          <CardBanner key={card.card_id} card={card} />
        ))}
      </>
    );
  };

  return (
    <Flex
      style={{ borderRight: "1px solid var(--mantine-color-dark-4)" }}
      className={"deck-leftbar"}
    >
      <LeftbarHeader />
      <Divider orientation={"horizontal"} w={"100%"} />
      <ScrollArea h={"100%"}>
        <Flex p={16} direction={"column"} gap={3}>
          <AnimatePresence>
            {!deck ? (
              decks.map((deck) => (
                <DeckContainer key={deck.id} deck={deck} hover />
              ))
            ) : (
              <>
                {renderCardGroup(
                  deck.cards.filter((card) => isType(card, "Equipment")),
                  "Equipment",
                )}
                {renderCardGroup(
                  deck.cards.filter((card) => isType(card, "Weapon")),
                  "Weapons",
                )}
                {renderCardGroup(
                  deck.cards.filter(
                    (card) =>
                      !isType(card, "Equipment") && !isType(card, "Weapon"),
                  ),
                  "Cards",
                )}
              </>
            )}
          </AnimatePresence>
        </Flex>
      </ScrollArea>
      <Divider orientation={"horizontal"} w={"100%"} />
      <LeftbarFooter open={open} />
    </Flex>
  );
}

export default DeckLeftbar;
