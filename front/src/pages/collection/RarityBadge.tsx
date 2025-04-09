import type { Rarity } from "@flesh-and-blood/types";
import { Badge } from "@mantine/core";

interface RarityBadgeProps {
  r: Rarity;
}

const rarityColorMap: Record<Rarity, string> = {
  Basic: "lightgray",
  Common: "gray",
  Token: "gray",
  Rare: "blue",
  "Super Rare": "pink",
  Majestic: "red",
  Legendary: "yellow",
  Fabled: "orange",
  Marvel: "violet",
  Promo: "green",
};

function RarityBadge({ r }: RarityBadgeProps) {
  const color = rarityColorMap[r] || "";

  return (
    <Badge className="arrow-badge" color={color}>
      {r}
    </Badge>
  );
}

export default RarityBadge;
