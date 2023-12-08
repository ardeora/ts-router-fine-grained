import {
  Link,
  Outlet,
  Route,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { root } from "./root";
import { z } from "zod";
import { Label } from "../components/Label";
import { RouteStatus } from "../components/RouteStatus";

const IndexComponent = () => {
  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col gap-3 pt-8 items-center">
      <Outlet />
    </div>
  );
};

const appSearchSchema = z.object({
  product_count: z.number().optional(),
  category_count: z.number().optional(),
});

export const indexRoute = new Route({
  getParentRoute: () => root,
  path: "/",
  component: IndexComponent,
  beforeLoad: (p) => {
    if (p.location.pathname === "/") {
      throw redirect({
        to: "/app/$product_id",
        params: {
          product_id: "electronics",
        },
      });
    }
  },
});

let appReRenderCount = 0;

const AppComponent = () => {
  const data = appRoute.useLoaderData();
  const navigate = useNavigate();
  const search = appRoute.useSearch({
    select: (search) => search.product_count,
  });

  appReRenderCount++;
  return (
    <>
      <RouteStatus />
      <div className="bg-zinc-900 container max-w-3xl rounded-lg border border-zinc-600 p-6 ">
        <div className="text-zinc-400 relative">
          <Label label="Products" key={appReRenderCount} />
          <div className="flex justify-between items-center pl-2 pr-2 pt-3">
            <div className="flex gap-2">
              {Object.entries(data).map(([key, value]) => {
                return (
                  <Link
                    key={key}
                    to="/app/$product_id"
                    className="px-3 rounded text-sm py-1 transition duration-200"
                    inactiveProps={{
                      className: "hover:bg-zinc-800",
                    }}
                    activeProps={{
                      className: "text-green-400 bg-green-900/30",
                    }}
                    params={{
                      product_id: value,
                    }}
                    search={(s) => ({ ...s })}
                  >
                    {key}
                  </Link>
                );
              })}
            </div>
            <div>
              <button
                className="text-sm border tabular-nums border-zinc-700 bg-zinc-800 py-0.5 px-2 rounded hover:border-green-600 transition-colors duration-200"
                onClick={() => {
                  navigate({
                    search: (search) => {
                      return {
                        ...search,
                        product_count: search.product_count
                          ? search.product_count + 1
                          : 1,
                      };
                    },
                  });
                }}
              >
                Product Count: {search || 0}
              </button>
            </div>
          </div>
          <div className="p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export const appRoute = new Route({
  getParentRoute: () => indexRoute,
  path: "app",
  component: AppComponent,
  validateSearch: (search) => appSearchSchema.parse(search),
  loader: async () => {
    return {
      Electronics: "/electronics",
      Clothing: "/clothing",
      Books: "/books",
    };
  },
});
