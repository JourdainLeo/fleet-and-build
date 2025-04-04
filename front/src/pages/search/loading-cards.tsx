import { Flex, Grid, Image, Skeleton } from "@mantine/core";
import { useStore } from "../../services/store";

function LoadingCards() {
  const store = useStore();

  return Array.from({ length: 50 }).map((_, index) => {
    return (
      <Grid.Col key={index} span={store.grid} className="card-container">
        <Flex className="card">
          <Skeleton visible={store.loading} animate radius={16}>
            <Image
              fit="contain"
              className="card-image fade-in"
              loading="lazy"
              src={"/public/ARC125.webp"}
            />
          </Skeleton>
        </Flex>
      </Grid.Col>
    );
  });
}

export default LoadingCards;
