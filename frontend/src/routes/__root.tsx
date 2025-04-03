import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import App from "../App";
import Collection from "../pages/collection";
import Decks from "../pages/decks";
import Home from "../pages/home";
import Search from "../pages/search";

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
