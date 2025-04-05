import { Card, Flex, Pagination as MantinePagination } from "@mantine/core";
import { useState } from "react";
import { useZustore } from "../../services/zustore";

function Pagination({ onChange }: { onChange?: (offset: number) => void }) {
  const [activePage, setPage] = useState(1);
  const count = useZustore((state) => state.count);
  const setLoading = useZustore((state) => state.setLoading);

  const getOffset = (page: number, totalPages: number, limit: number = 50) => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    return (safePage - 1) * limit;
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
            if (onChange) onChange(getOffset(value, count / 50));
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
