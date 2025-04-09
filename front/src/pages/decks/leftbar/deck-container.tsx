import type { DeckApi } from "@fleet-and-build/api";
import { Flex, Image, Text } from "@mantine/core";
import {
  IconClipboard,
  IconCopy,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { Action } from "../../../components/Action";
import { useZustore } from "../../../services/zustore";

function DeckContainer({ deck }: { deck: DeckApi }) {
  const setDeck = useZustore((state) => state.setDeck);

  return (
    <Flex
      pt={8}
      style={{ backgroundColor: "black" }}
      className={"hover transition"}
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
          />
        </Flex>
        <Flex>
          <Action
            icon={<IconClipboard size={16} color={"gray"} />}
            variant={"subtle"}
          />
          <Action
            icon={<IconCopy size={16} color={"gray"} />}
            variant={"subtle"}
          />
          <Action
            icon={<IconTrash size={16} color={"gray"} />}
            variant={"subtle"}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default DeckContainer;
