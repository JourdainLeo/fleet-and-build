import { cards } from "@flesh-and-blood/cards";
import type { SearchCard } from "@flesh-and-blood/search";
import FabSearch from "@flesh-and-blood/search";
import {
  Button,
  Flex,
  Grid,
  Image,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
interface CardImage {
  large: string;
  normal: string;
  small: string;
}

interface Card {
  back_face: string | null;
  card_id: string;
  card_type: string;
  cost: string;
  defense: string;
  display_name: string;
  image: CardImage;
  intellect: string;
  life: string;
  name: string;
  object_type: string;
  pitch: string;
  power: string;
  text: string;
  text_html: string;
  typebox: string;
  url: string;
}
function Search() {
  const [query, setQuery] = useState("");
  const [img, setImg] = useState("");
  const [results, setResults] = useState<SearchCard[]>(cards);
  const search = new FabSearch(cards);
  const [cards2, setCards2] = useState<Card[]>([]);
  const [next, setNext] = useState<string>(
    "https://cards.fabtcg.com/api/search/v1/cards/",
  );
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(
          "https://cards.fabtcg.com/api/search/v1/cards/",
        );
        if (!response.ok)
          throw new Error("Erreur lors du chargement des cartes");

        const data = await response.json();
        setCards2(data.results); // Assure que c'est bien un tableau
        setNext(data.next);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCards();
  }, []);
  console.log(cards2);
  return (
    <Flex flex={1} h={"82vh"}>
      <Flex flex={1} direction={"column"} gap={16} h="100%">
        <TextInput
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setResults(
              search.search(e.target.value.toLowerCase()).searchResults,
            );
            if (e.target.value.length <= 0) {
              setResults(cards);
            }
          }}
          placeholder="Search for a card..."
        />
        <Flex flex={1} h={"100%"}>
          <ScrollArea h={"100%"} w="100%" flex={1}>
            <Grid gutter={16} align={"stretch"}>
              {cards2.map((item, index) => (
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
