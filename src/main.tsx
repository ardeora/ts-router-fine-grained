import ReactDOM from "react-dom/client";
import { RouterProvider, Router } from "@tanstack/react-router";
import { root } from "./routes/root";
import { appRoute, indexRoute } from "./routes";
import "./index.css";
import { productRoute } from "./routes/products/$product_id";
import { categoryRoute } from "./routes/products/categories/$category_id";

const routeTree = root.addChildren([
  indexRoute.addChildren([
    appRoute.addChildren([productRoute.addChildren([categoryRoute])]),
  ]),
]);

// Set up a Router instance
const router = new Router({
  routeTree,
  // defaultPreload: "intent",
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
