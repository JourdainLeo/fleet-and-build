export interface CardImage {
  large: string;
  normal: string;
  small: string;
}

export interface Card {
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
  quantity: number;
}
