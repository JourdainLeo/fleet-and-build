import { Badge } from "@mantine/core";

function RarityBadge({ r }: { r: string }) {
  return (
    <Badge
      className={"arrow-badge"}
      color={
        r === "Common" || r === "Token"
          ? "gray"
          : r === "Rare"
            ? "blue"
            : r === "Super Rare"
              ? "pink"
              : r === "Majestic"
                ? "red"
                : r === "Legendary"
                  ? "yellow"
                  : r === "Fabled"
                    ? "orange"
                    : r === "Marvel"
                      ? "violet"
                      : r === "Promo"
                        ? "green"
                        : ""
      }
    >
      {r}
    </Badge>
  );
}

export default RarityBadge;
