import { Flex, Image, Text } from "@mantine/core";
import {
  IconClipboard,
  IconCopy,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { Action } from "../../../components/Action";
import { useZustore } from "../../../services/zustore";

function LeftbarHeader() {
  const deck = useZustore((state) => state.deck);

  return (
    <>
      {!deck ? (
        <Flex align={"center"} justify={"center"} p={16}>
          <Text fw={600} fz={24}>
            My Decks
          </Text>
        </Flex>
      ) : (
        <Flex
          pt={8}
          style={{ backgroundColor: "black" }}
          w={"100%"}
          direction={"column"}
          className={"deck2"}
        >
          <Flex h={100} w={"100%"} className={"deck-container"}>
            <Image src={deck.image} className={"deck-image"} />
          </Flex>
          <Flex align={"center"} justify={"space-between"} pl={8}>
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
      )}
    </>
  );
}

export default LeftbarHeader;
