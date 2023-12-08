import ReactDOM from "react-dom/client";
import { RouterProvider, Router } from "@tanstack/react-router";
import { root } from "./routes/root";
import { appRoute, indexRoute, productRoute } from "./routes";
import "./index.css";

const routeTree = root.addChildren([
  indexRoute.addChildren([appRoute.addChildren([productRoute])]),
]);

// Set up a Router instance
const router = new Router({
  routeTree,
  defaultPreload: "intent",
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(<RouterProvider router={router} />);
}
