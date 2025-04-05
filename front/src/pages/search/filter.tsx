import { Button, Flex, Card as MantineCard, TextInput } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconFilterFilled } from "@tabler/icons-react";
import { useEffect } from "react";
import { useZustore } from "../../services/zustore";
import FilterModal from "./filter-modal";

function Filter({ fetch }: { fetch: (debounced: string) => void }) {
  const [opened, { open, close }] = useDisclosure(false);
  const q = useZustore((state) => state.q);
  const setQ = useZustore((state) => state.setQ);
  const setLoading = useZustore((state) => state.setLoading);
  const [debounced] = useDebouncedValue(q, 200);

  useEffect(() => {
    setLoading(true);
    fetch(debounced);
  }, [debounced]);

  return (
    <MantineCard style={{ borderRadius: 0 }}>
      <Flex mb={8} gap={16}>
        <TextInput
          flex={1}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={"Search cards..."}
        />
        <Button leftSection={<IconFilterFilled />} onClick={open}>
          Filter
        </Button>
      </Flex>
      <FilterModal opened={opened} close={close} />
    </MantineCard>
  );
}

export default Filter;
