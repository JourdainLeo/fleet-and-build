import {
  ActionIcon,
  Badge,
  Button,
  Flex,
  Card as MantineCard,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconFilterFilled, IconSquare, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { useZustore } from "../../services/zustore";
import FilterModal from "./filter-modal";

function Filter({ fetch }: { fetch: (debounced: string) => void }) {
  const [opened, { open, close }] = useDisclosure(false);
  const q = useZustore((state) => state.q);
  const setQ = useZustore((state) => state.setQ);
  const setGrid = useZustore((state) => state.setGrid);
  const setLoading = useZustore((state) => state.setLoading);
  const [debounced] = useDebouncedValue(q, 200);
  const activeFilters = useZustore((state) => state.getActiveFilters);
  const filtersToDisplay = Object.entries(activeFilters()).filter(
    ([_, value]) => value !== undefined,
  );

  const setFilter = useZustore((state) => state.setFilter);

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
      <Flex justify={"space-between"} align={"center"}>
        <Flex gap="sm">
          {filtersToDisplay.map(([key, value]) => {
            if (
              key === "pitch" ||
              key === "defense" ||
              key === "attack" ||
              key === "cost"
            ) {
              console.log(key, value);
              const operatorKey = `${key}_operator`;
              const operatorValue = filtersToDisplay.find(
                (v) => v[0] === operatorKey,
              )?.[1];

              return (
                operatorValue && (
                  <Badge key={key} size={"md"}>
                    <Flex justify={"center"} align={"center"} gap={8}>
                      {`${key.charAt(0).toUpperCase() + key.slice(1)} ${operatorValue} ${value}`}
                      <ActionIcon
                        size={16}
                        onClick={() => setFilter(key, undefined)}
                      >
                        <IconX />
                      </ActionIcon>
                    </Flex>
                  </Badge>
                )
              );
            }

            if (key.includes("operator")) return;

            return (
              <Badge key={key}>
                <Flex justify={"center"} align={"center"} gap={8}>
                  {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
                  <ActionIcon
                    size={16}
                    onClick={() => setFilter(key as any, undefined)}
                  >
                    <IconX />
                  </ActionIcon>
                </Flex>
              </Badge>
            );
          })}
        </Flex>
        <Flex align={"center"} justify={"center"}>
          <ActionIcon variant={"subtle"}>
            <IconSquare
              size={18}
              onClick={() => {
                setGrid({
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
              setGrid({
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
              setGrid({
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
      <FilterModal opened={opened} close={close} />
    </MantineCard>
  );
}

export default Filter;
