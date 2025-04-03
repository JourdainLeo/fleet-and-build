import type { Card } from "./card";

export interface User {
  id: number;
  name: string;
  email: string;
  collection: Card[];
}
