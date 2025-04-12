import type { CollectionCard, DeckApi } from "@fleet-and-build/api";
import { Flex, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Action } from "../../components/Action";
import CardGrid from "../../components/CardGrid";
import Filter from "../../components/Filter";
import { useApi } from "../../services/api";
import { useZustore } from "../../services/zustore";

function DeckSearch() {
  const deck = useZustore((state) => state.deck);
  const api = useApi();
  const cards = useZustore((state) => state.cards);
  const setCards = useZustore((state) => state.setCards);
  const setCount = useZustore((state) => state.setCount);
  const setLoading = useZustore((state) => state.setLoading);
  const setDeck = useZustore((state) => state.setDeck);
  const maxQuantity = deck?.type === "Blitz" ? 2 : 3;

  function isEquipmentSlotTaken(slot: string): boolean {
    return deck?.cards.some((card) => card.subtypes?.includes(slot)) ?? false;
  }

  function getEquippedWeapons(deck: DeckApi): CollectionCard[] {
    return deck.cards.filter((c) => c.types?.includes("Weapon"));
  }

  function isValidWeaponLoadout(): boolean {
    if (!deck) return false;
    const weapons = getEquippedWeapons(deck);
    if (weapons.length === 0) return true;
    if (weapons.length === 1) {
      return !weapons[0].subtypes.includes("2H");
    }
    if (weapons.length === 2) {
      return weapons.every((w) => w.subtypes?.includes("1H"));
    }
    return false;
  }

  return (
    <Flex flex={1}>
      <Filter
        fetch={(query) => {
          api.get("/cards", { id: 1 }, query).then((r) => {
            setCount(r.count);
            setCards(r.results);
            setLoading(false);
          });
        }}
      >
        <CardGrid
          items={cards}
          render={(item) => {
            if (!deck) return;
            return (
              <Flex className="hover-bar" gap={16}>
                <Action
                  disabled={!deck.cards.find((c) => c.card_id === item.card_id)}
                  className="card-button"
                  icon={<IconMinus />}
                  onClick={() => {
                    const newDeck = {
                      ...deck,
                      cards: deck?.cards.reduce((acc, c) => {
                        if (c.card_id === item.card_id) {
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
                />
                <Text fw={900} size={"20"}>
                  {deck.cards.find((c) => c.card_id === item.card_id)
                    ?.quantity ?? 0}
                </Text>
                <Action
                  className="card-button"
                  icon={<IconPlus />}
                  disabled={
                    deck.cards.find((c) => c.card_id === item.card_id)
                      ?.quantity === maxQuantity ||
                    item.subtypes?.some(
                      (slot) =>
                        ["Head", "Chest", "Arms", "Legs"].includes(slot) &&
                        isEquipmentSlotTaken(slot),
                    ) ||
                    item.types?.some(
                      (slot) =>
                        ["Weapon"].includes(slot) && !isValidWeaponLoadout(),
                    )
                  }
                  onClick={() => {
                    const newDeck = {
                      ...deck,
                      cards: (() => {
                        let found = false;

                        const updatedCards = deck?.cards.reduce(
                          (acc, c) => {
                            if (c.card_id === item.card_id) {
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
                            ...item,
                            quantity: 1,
                          } as CollectionCard);
                        }

                        return updatedCards;
                      })(),
                    };

                    setDeck(newDeck as DeckApi);
                  }}
                />
              </Flex>
            );
          }}
        />
      </Filter>
    </Flex>
  );
}

export default DeckSearch;
