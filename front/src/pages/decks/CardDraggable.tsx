import { useDraggable } from "@dnd-kit/core";
import type { Card } from "@fleet-and-build/api";
import { Image } from "@mantine/core";

const CardDraggable = ({ card }: { card: Card }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.card_id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
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
