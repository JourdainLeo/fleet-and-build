import { Card, Flex, Pagination as MantinePagination } from "@mantine/core";
import { useState } from "react";
import { useApi } from "../../services/api";
import { useStore } from "../../services/store";

function Pagination({ onChange }: { onChange?: (offset: number) => void }) {
  const store = useStore();
  const api = useApi();
  const [activePage, setPage] = useState(1);

  const getOffset = (page: number, totalPages: number, limit: number = 50) => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    return (safePage - 1) * limit;
  };

  return (
    <Flex justify={"center"} align={"center"} mt={16}>
      <Card style={{ borderRadius: 16, padding: 8 }}>
        <MantinePagination
          total={store.count / 50}
          value={activePage}
          onChange={async (value) => {
            store.setLoading(true);
            setPage(value);
            if (onChange) onChange(getOffset(value, store.count / 50));
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
