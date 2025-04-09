import { useDraggable } from "@dnd-kit/core";
import type { Card } from "@fleet-and-build/api";
import { Image } from "@mantine/core";

const CardDraggable = ({ card }: { card: Card }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: card.card_id,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <Image
        src={card.image.normal}
        fit="contain"
        className="card-image fade-in"
        loading="lazy"
      />
    </div>
  );
};

export default CardDraggable;
