import cors from "@fastify/cors";
import { config } from "dotenv";
import Fastify from "fastify";
import { cardsRoutes } from "./routes/cards";
import { collectionRoutes } from "./routes/collection";
import { decksRoutes } from "./routes/decks";
import { userRoutes } from "./routes/user";
config();

const app = Fastify();

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});
app.register(import("@fastify/sensible"));

app.register(userRoutes);
app.register(collectionRoutes);
app.register(cardsRoutes);
app.register(decksRoutes);

app.listen({ port: 3000 }, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
