import type { Card, CollectionCard } from "@fleet-and-build/api";
import { Flex, Grid, Image, ScrollArea } from "@mantine/core";
import React from "react";
import { useZustore } from "../services/zustore";
import LoadingGrid from "./filter/LoadingGrid";

function CardGrid<T extends Card | CollectionCard>({
  render,
  onClick,
  items,
  hover,
}: {
  render?: (item: T) => React.ReactNode;
  onClick?: (item: T) => void;
  items: T[];
  hover?: boolean;
}) {
  const loading = useZustore((state) => state.loading);
  const grid = useZustore((state) => state.grid);

  return (
    <ScrollArea h={"100%"} mr={32} ml={32}>
      <Grid gutter={16} align={"stretch"} p={16}>
        {!loading ? (
          items.map((item) => (
            <Grid.Col
              key={item.card_id}
              span={grid}
              className={"transition " + (hover ? "hover" : "")}
              onClick={() => {
                if (onClick) onClick(item);
              }}
            >
              <Flex className="card">
                <Image
                  src={item.image.normal}
                  fit="contain"
                  className="card-image fade-in"
                  loading={"lazy"}
                />

                {render && render(item)}
              </Flex>
            </Grid.Col>
          ))
        ) : (
          <LoadingGrid />
        )}
      </Grid>
    </ScrollArea>
  );
}

export default CardGrid;
