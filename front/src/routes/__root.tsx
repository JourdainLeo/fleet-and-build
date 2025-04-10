import { Combobox } from "@mantine/core";
import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import App from "../App";
import Collection from "../pages/Collection";
import Decks from "../pages/Decks";
import Home from "../pages/Home";
import Search = Combobox.Search;

const rootRoute = createRootRoute({
  component: App,
});

const homeRoute = createRoute({
  path: "/",
  getParentRoute: () => rootRoute,
  component: Home,
});

const collectionRoute = createRoute({
  path: "/collection",
  getParentRoute: () => rootRoute,
  component: Collection,
});

const decksRoute = createRoute({
  path: "/decks",
  getParentRoute: () => rootRoute,
  component: Decks,
});

const searchRoute = createRoute({
  path: "/search",
  getParentRoute: () => rootRoute,
  component: Search,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  collectionRoute,
  decksRoute,
  searchRoute,
]);

const router = createRouter({ routeTree });

export default router;
