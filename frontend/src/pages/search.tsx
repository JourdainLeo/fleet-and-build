import type { Card } from "@fleet-and-build/types";
import {
  Button,
  Flex,
  Grid,
  Image,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useApi } from "../services/api";

function Search() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [next, setNext] = useState<string>(
    "https://cards.fabtcg.com/api/search/v1/cards/",
  );

  const api = useApi();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(
          "https://cards.fabtcg.com/api/search/v1/cards/",
        );
        if (!response.ok)
          throw new Error("Erreur lors du chargement des cartes");

        const data = await response.json();
        setCards(data.results);
        setNext(data.next);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await api.get("/user/:id", { id: 1 });
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
    fetchCards();
  }, []);

  return (
    <Flex flex={1} h={"82vh"}>
      <Flex flex={1} direction={"column"} gap={16} h="100%">
        <TextInput
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Search for a card..."
        />
        <Flex flex={1} h={"100%"}>
          <ScrollArea h={"100%"} w="100%" flex={1}>
            <Grid gutter={16} align={"stretch"}>
              {cards.map((item, index) => (
                <Grid.Col
                  key={index}
                  span={{ lg: 1.714, sm: 3, xs: 4, md: 3, xl: 2 }}
                >
                  <Image src={item.image.normal} fit="contain" />
                </Grid.Col>
              ))}
            </Grid>
          </ScrollArea>
        </Flex>
        <Flex align={"center"} justify={"center"} gap={16}>
          <Button>Previous</Button>
          <Button>Next</Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Search;
