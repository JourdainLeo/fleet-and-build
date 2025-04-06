import type { FilterQuery } from "@fleet-and-build/api";
import { Card, Flex, Pagination as MantinePagination } from "@mantine/core";
import { useState } from "react";
import { useZustore } from "../../services/zustore";

function Pagination({ onChange }: { onChange?: (query: FilterQuery) => void }) {
  const [activePage, setPage] = useState(1);
  const count = useZustore((state) => state.count);
  const setLoading = useZustore((state) => state.setLoading);

  const getOffset = (page: number, totalPages: number, limit: number = 50) => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    return (safePage - 1) * limit;
  };

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

  return (
    <Flex justify={"center"} align={"center"} mt={16}>
      <Card style={{ padding: 8 }}>
        <MantinePagination
          total={count / 50}
          value={activePage}
          onChange={async (value) => {
            setLoading(true);
            setPage(value);
            if (onChange)
              onChange({
                ...activeFilters,
                limit: 50,
                offset: getOffset(value, count / 50),
                order: order,
              });
          }}
          withEdges
          size="md"
          radius="xl"
          siblings={1}
          boundaries={1}
        />
      </Card>
    </Flex>
  );
}

export default Pagination;
