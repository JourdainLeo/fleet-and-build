import { Flex } from "@mantine/core";
import { Action } from "../../../components/Action";
import { useZustore } from "../../../services/zustore";

function LeftbarFooter({ open }: { open: () => void }) {
  const deck = useZustore((state) => state.deck);
  const setDeck = useZustore((state) => state.setDeck);
  const setDecks = useZustore((state) => state.setDecks);
  return (
    <Flex p={8} style={{ backgroundColor: "black" }} justify={"flex-end"}>
      {deck ? (
        <Action
          label={"Done"}
          onClick={async ({ api }) => {
            const cards = deck.cards.map((card) => ({
              card_id: card.card_id,
              quantity: card.quantity,
            }));

            await api.put(
              "/user/:id/deck/:deck_id",
              { ...deck, cards: cards },
              { id: 1, deck_id: deck?.id },
              async () => {
                setDeck(null);
                await api.get("/user/:id/decks", { id: 1 }).then((r) => {
                  setDecks(r.results);
                });
              },
            );
          }}
        />
      ) : (
        <Action label={"Create"} onClick={open} />
      )}
    </Flex>
  );
}

export default LeftbarFooter;
