import { cards } from "@flesh-and-blood/cards";
import type { SearchCard } from "@flesh-and-blood/search";
import FabSearch from "@flesh-and-blood/search";
import { Card, Flex, Image, ScrollArea, Text, TextInput } from "@mantine/core";
import { useState } from "react";

function Search() {
  const [query, setQuery] = useState("");
  const [img, setImg] = useState("");
  const [results, setResults] = useState<SearchCard[]>([]);
  const search = new FabSearch(cards);
  const getCardImageUrl = (cardId: string) => {
    return `https://d2wlb52bya4y8z.cloudfront.net/media/cards/large/${cardId}.webp`;
  };
  return (
    <Flex gap={16}>
      <Flex
        direction={"column"}
        w={300}
        gap={16}
        style={{ backgroundColor: "red" }}
      >
        <TextInput
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setResults(
              search.search(e.target.value.toLowerCase()).searchResults,
            );
          }}
          placeholder="Search for a card..."
        />
        <ScrollArea>
          <Flex direction={"column"} gap={4}>
            {results.slice(0, 50).map((item, index) => (
              <Card
                key={index}
                withBorder
                onMouseEnter={() =>
                  setImg(getCardImageUrl(item.defaultImage ?? ""))
                }
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text>{item.name}</Text>
                {item.cost !== undefined && (
                  <Flex
                    h={16}
                    w={16}
                    style={{
                      borderRadius: 32,
                      backgroundColor:
                        item.pitch === 1
                          ? "red"
                          : item.pitch === 2
                            ? "yellow "
                            : "blue",
                    }}
                  />
                )}
              </Card>
            ))}
          </Flex>
        </ScrollArea>
      </Flex>
      <Flex flex={1} direction={"column"} gap={8}>
        <TextInput></TextInput>
        <Flex>
          <Image src={img} width={"auto"} height={350} />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Search;
