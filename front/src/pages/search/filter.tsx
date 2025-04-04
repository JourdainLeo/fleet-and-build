import {
  ActionIcon,
  Card as CardComponent,
  Flex,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSquare } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useStore } from "../../services/store";

function Filter({ fetch }: { fetch: (debounced: string) => void }) {
  const [query, setQuery] = useState("");
  const [debounced] = useDebouncedValue(query, 200);
  const store = useStore();

  useEffect(() => {
    store.setLoading(true);

    fetch(debounced);
  }, [debounced]);

  return (
    <CardComponent>
      <Flex mb={8}>
        <TextInput
          radius={16}
          w={"100%"}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder={"Search cards..."}
        />
      </Flex>
      <Flex justify={"flex-end"} align={"center"}>
        <Flex align={"center"} justify={"center"}>
          <ActionIcon variant={"subtle"}>
            <IconSquare
              size={18}
              onClick={() => {
                store.setGrid({
                  lg: 1.5,
                  sm: 3,
                  xs: 4,
                  md: 3,
                });
              }}
            />
          </ActionIcon>
          <ActionIcon
            variant={"subtle"}
            onClick={() => {
              store.setGrid({
                lg: 2,
                sm: 3,
                xs: 4,
                md: 3,
              });
            }}
          >
            <Flex direction={"column"} align="center" justify={"center"}>
              {Array.from({ length: 2 }).map((_, rowIndex) => (
                <Flex key={rowIndex} align="center" justify={"center"}>
                  {Array.from({ length: 2 }).map((_, colIndex) => (
                    <IconSquare key={colIndex} size={9} />
                  ))}
                </Flex>
              ))}
            </Flex>
          </ActionIcon>
          <ActionIcon
            variant={"subtle"}
            onClick={() => {
              store.setGrid({
                lg: 2.4,
                sm: 3,
                xs: 4,
                md: 3,
              });
            }}
          >
            <Flex direction={"column"} align="center" justify={"center"}>
              {Array.from({ length: 3 }).map((_, rowIndex) => (
                <Flex key={rowIndex} align="center" justify={"center"}>
                  {Array.from({ length: 3 }).map((_, colIndex) => (
                    <IconSquare key={colIndex} size={6} />
                  ))}
                </Flex>
              ))}
            </Flex>
          </ActionIcon>
        </Flex>
      </Flex>
    </CardComponent>
  );
}

export default Filter;
