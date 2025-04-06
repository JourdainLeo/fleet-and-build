import type { FilterQuery } from "@fleet-and-build/api";
import {
  ActionIcon,
  Badge,
  Button,
  Flex,
  Card as MantineCard,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import {
  IconFilterFilled,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconSquare,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useZustore } from "../../services/zustore";
import FilterModal from "./filter-modal";

function Filter({ fetch }: { fetch: (query: FilterQuery) => void }) {
  const [opened, { open, close }] = useDisclosure(false);
  const q = useZustore((state) => state.q);
  const setQ = useZustore((state) => state.setQ);
  const setGrid = useZustore((state) => state.setGrid);
  const setLoading = useZustore((state) => state.setLoading);
  const hero = useZustore((s) => s.hero);
  const set = useZustore((s) => s.set);
  const type = useZustore((s) => s.type);
  const rarity = useZustore((s) => s.rarity);
  const fusion = useZustore((s) => s.fusion);
  const artist = useZustore((s) => s.artist);
  const pitch = useZustore((s) => s.pitch);
  const pitch_operator = useZustore((s) => s.pitch_operator);
  const defense = useZustore((s) => s.defense);
  const defense_operator = useZustore((s) => s.defense_operator);
  const attack = useZustore((s) => s.attack);
  const attack_operator = useZustore((s) => s.attack_operator);
  const cost = useZustore((s) => s.cost);
  const cost_operator = useZustore((s) => s.cost_operator);
  const order = useZustore((s) => s.order);
  const [debounced] = useDebouncedValue(q, 200);
  const activeFilters = {
    hero,
    set,
    type,
    rarity,
    fusion,
    artist,
    pitch,
    pitch_operator,
    defense,
    defense_operator,
    attack,
    attack_operator,
    cost,
    cost_operator,
  };
  const filtersToDisplay = Object.entries(activeFilters).filter(
    ([_, value]) => value !== undefined,
  );

  const setFilter = useZustore((state) => state.setFilter);

  useEffect(() => {
    setLoading(true);
    fetch({
      q: debounced,
      ...activeFilters,
      order: order,
      limit: 50,
      offset: 0,
    });
  }, [debounced]);

  useEffect(() => {
    setFilter("hero", undefined);
    setFilter("set", undefined);
    setFilter("type", undefined);
    setFilter("rarity", undefined);
    setFilter("fusion", undefined);
    setFilter("artist", undefined);
    setFilter("pitch", undefined);
    setFilter("pitch_operator", undefined);
    setFilter("defense", undefined);
    setFilter("defense_operator", undefined);
    setFilter("attack", undefined);
    setFilter("attack_operator", undefined);
    setFilter("cost", undefined);
    setFilter("cost_operator", undefined);
    setFilter("order", "asc");
  }, []);

  return (
    <MantineCard style={{ borderRadius: 0 }}>
      <Flex mb={8} gap={16} align={"center"}>
        <TextInput
          flex={1}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={"Search cards..."}
        />
        <Button
          leftSection={<IconSearch />}
          onClick={() => {
            setLoading(true);
            fetch({ q: debounced, ...activeFilters, order: order });
          }}
        >
          Search
        </Button>

        <Button leftSection={<IconFilterFilled />} onClick={open}>
          Filter
        </Button>
        <ActionIcon
          variant={"subtle"}
          onClick={() => {
            setFilter("order", order === "asc" ? "desc" : "asc");
            setLoading(true);
            fetch({
              q: debounced,
              ...activeFilters,
              order: order === "asc" ? "desc" : "asc",
            });
          }}
        >
          {order === "asc" ? <IconSortAscending /> : <IconSortDescending />}
        </ActionIcon>
      </Flex>
      <Flex justify={"space-between"} align={"center"}>
        <Flex gap="sm" component={motion.div} layout>
          <AnimatePresence>
            {filtersToDisplay.map(([key, value]) => {
              if (
                key === "pitch" ||
                key === "defense" ||
                key === "attack" ||
                key === "cost"
              ) {
                const operatorKey = `${key}_operator`;
                const operatorValue =
                  activeFilters[operatorKey as keyof typeof activeFilters];

                return (
                  operatorValue && (
                    <motion.div
                      key={key}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge
                        size={"md"}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Flex gap={8} align={"center"}>
                          {`${key.charAt(0).toUpperCase() + key.slice(1)} ${operatorValue} ${value}`}
                          <ActionIcon
                            size={16}
                            onClick={() => setFilter(key, undefined)}
                          >
                            <IconX />
                          </ActionIcon>
                        </Flex>
                      </Badge>
                    </motion.div>
                  )
                );
              }

              if (key.includes("operator")) return null;

              return (
                <motion.div
                  key={key}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge
                    size="md"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Flex align="center" gap={8}>
                      {`${key.toUpperCase()}: ${value}`}
                      <ActionIcon
                        size={16}
                        onClick={() => setFilter(key as any, undefined)}
                      >
                        <IconX />
                      </ActionIcon>
                    </Flex>
                  </Badge>
                </motion.div>
              );
            })}
          </AnimatePresence>
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
