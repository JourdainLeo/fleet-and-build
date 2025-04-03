import cors from "@fastify/cors";
import { config } from "dotenv";
import Fastify from "fastify";
import { userRoutes } from "./routes";
config();

const app = Fastify({ logger: true });

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});
app.register(import("@fastify/sensible"));

app.register(userRoutes);

app.listen({ port: 3000 }, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
