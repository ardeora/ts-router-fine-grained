import { Outlet, RootRoute } from "@tanstack/react-router";

const RootComponent = () => {
  return <Outlet />;
};

export const root = new RootRoute({
  component: RootComponent,
});
