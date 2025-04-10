import type { DeckApi } from "@fleet-and-build/api";
import { Flex, Image, Text } from "@mantine/core";
import {
  IconClipboard,
  IconCopy,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Action } from "../../../components/Action";
import { useZustore } from "../../../services/zustore";

function DeckContainer({ deck, hover }: { deck: DeckApi; hover?: boolean }) {
  const setDeck = useZustore((state) => state.setDeck);
  const setDecks = useZustore((state) => state.setDecks);

  console.log(deck);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Flex
        pt={8}
        style={{ backgroundColor: "black" }}
        className={hover ? "hover transition" : ""}
        w={"100%"}
        direction={"column"}
        onClick={() => {
          setDeck(deck);
        }}
      >
        <Flex h={100} w={"100%"} className={"deck-container"}>
          <Image src={deck.image} className={"deck-image"} />
        </Flex>
        <Flex align={"center"} pl={8} justify={"space-between"}>
          <Flex align={"center"}>
            <Text>{deck.name}</Text>
            <Action
              icon={<IconPencil size={16} color={"gray"} />}
              variant={"subtle"}
              onClick={({}, e) => {
                e.stopPropagation();
              }}
            />
          </Flex>
          <Flex>
            <Action
              icon={<IconClipboard size={16} color={"gray"} />}
              variant={"subtle"}
              onClick={({}, e) => {
                e.stopPropagation();
              }}
            />
            <Action
              icon={<IconCopy size={16} color={"gray"} />}
              variant={"subtle"}
              onClick={({}, e) => {
                e.stopPropagation();
              }}
            />
            <Action
              icon={<IconTrash size={16} color={"gray"} />}
              variant={"subtle"}
              onClick={async ({ api }, e) => {
                e.stopPropagation();

                console.log(deck);
                await api.delete(
                  "/user/:id/deck/:deck_id",
                  { id: 1, deck_id: deck.id },
                  (json) => {
                    setDecks(json.results);
                    setDeck(null);
                  },
                );
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    </motion.div>
  );
}

export default DeckContainer;
