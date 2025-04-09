import { Flex } from "@mantine/core";
import { Action } from "../../../components/Action";
import { useZustore } from "../../../services/zustore";

function LeftbarFooter({ open }: { open: () => void }) {
  const deck = useZustore((state) => state.deck);
  const setDeck = useZustore((state) => state.setDeck);

  return (
    <Flex p={8} style={{ backgroundColor: "black" }} justify={"flex-end"}>
      {deck ? (
        <Action
          label={"Done"}
          onClick={() => {
            setDeck(null);
          }}
        />
      ) : (
        <Action label={"Create"} onClick={open} />
      )}
    </Flex>
  );
}

export default LeftbarFooter;
