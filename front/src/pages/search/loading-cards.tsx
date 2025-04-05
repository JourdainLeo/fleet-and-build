import { Flex, Grid, Image, Skeleton } from "@mantine/core";
import { useZustore } from "../../services/zustore";

function LoadingCards() {
  const grid = useZustore((state) => state.grid);
  const loading = useZustore((state) => state.loading);

  return Array.from({ length: 50 }).map((_, index) => {
    return (
      <Grid.Col key={index} span={grid} className="card-container">
        <Flex className="card">
          <Skeleton visible={loading} animate>
            <Image
              fit="contain"
              className="card-image fade-in"
              loading="lazy"
              src={"/ARC125.webp"}
            />
          </Skeleton>
        </Flex>
      </Grid.Col>
    );
  });
}

export default LoadingCards;
