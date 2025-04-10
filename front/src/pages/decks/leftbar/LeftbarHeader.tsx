import { Flex, Text } from "@mantine/core";
import { useZustore } from "../../../services/zustore";
import DeckContainer from "./DeckContainer";

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
        <DeckContainer deck={deck} />
      )}
    </>
  );
}

export default LeftbarHeader;
