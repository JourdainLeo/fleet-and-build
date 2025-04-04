import { Card, Flex, Pagination as MantinePagination } from "@mantine/core";
import { useState } from "react";
import { useStore } from "../../services/store";

function Pagination() {
  const store = useStore();
  const [activePage, setPage] = useState(1);

  const getUrl = (
    page: number,
    totalPages: number,
    limit: number = 50,
  ): string => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    const offset = (safePage - 1) * limit;

    const url = new URL(store.baseUrl);
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("offset", offset.toString());

    return url.toString();
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
            const url = getUrl(value, store.count / 50);
            store.fetchCards(url).then(() => {
              store.setLoading(false);
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
