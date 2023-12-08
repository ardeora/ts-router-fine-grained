import {
  Link,
  Outlet,
  Route,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { root } from "./root";
import { z } from "zod";
import { motion } from "framer-motion";

const IndexComponent = () => {
  return (
    <div className="bg-zinc-950 h-screen flex p-16 justify-center">
      <div className="bg-zinc-900 container max-w-3xl rounded-lg border border-zinc-600 p-6 ">
        <Outlet />
      </div>
    </div>
  );
};

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

const Label = ({ label }: { label: string }) => {
  return (
    <motion.div
      initial={{
        borderColor: "rgb(22 163 74)",
      }}
      animate={{
        borderColor: "rgb(113 113 122)",
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
      className="absolute w-[calc(100%_+_16px)] h-[calc(100%_+_16px)] -translate-x-2 -translate-y-2 pointer-events-none border rounded border-dashed "
    >
      <motion.div
        className="absolute px-3 top-0 -translate-y-1/2 left-4 text-xs rounded-full pointer-events-none leading-relaxed"
        initial={{
          backgroundColor: "rgb(22 163 74)",
          color: "rgb(255 255 255)",
        }}
        animate={{
          backgroundColor: "rgb(63 63 70)",
          color: "rgb(212 212 216)",
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
};

let appReRenderCount = 0;

const AppComponent = () => {
  const data = appRoute.useLoaderData();
  const navigate = useNavigate();
  const search = appRoute.useSearch({
    select: (search) => search.product_count,
  });

  appReRenderCount++;
  return (
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
              >
                {key}
              </Link>
            );
          })}
        </div>
        <div>
          <button
            className="text-sm border border-zinc-700 bg-zinc-800 py-0.5 px-2 rounded"
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
  );
};

const appSearchSchema = z.object({
  product_count: z.number().optional(),
  category_count: z.number().optional(),
});

export const appRoute = new Route({
  getParentRoute: () => indexRoute,
  path: "app",
  component: AppComponent,
  loader: async () => {
    return {
      Electronics: "/electronics",
      Clothing: "/clothing",
      Books: "/books",
    };
  },
  validateSearch: (search) => appSearchSchema.parse(search),
});

let productReRenderCount = 0;
const ProductComponent = () => {
  const data = productRoute.useLoaderData();
  const search = productRoute.useSearch({
    select: (search) => search.category_count,
  });
  const navigate = useNavigate();

  productReRenderCount++;

  return (
    <div className="text-zinc-400 relative mt-4">
      <Label label="Categories" key={productReRenderCount} />
      <div className="py-4 text-sm flex justify-between items-center px-2">
        <div>{data.join(", ")}</div>
        <button
          className="text-sm border border-zinc-700 bg-zinc-800 py-0.5 px-2 rounded"
          onClick={() => {
            navigate({
              search: (search) => {
                return {
                  ...search,
                  category_count: search.category_count
                    ? search.category_count + 1
                    : 1,
                };
              },
            });
          }}
        >
          Category Count: {search || 0}
        </button>
      </div>
    </div>
  );
};

export const productRoute = new Route({
  getParentRoute: () => appRoute,
  path: "$product_id",
  component: ProductComponent,
  loader: async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const { product_id } = params;

    const categoriesMap = {
      electronics: ["All", "Phones", "Laptops", "Tablets"],
      clothing: ["All", "Shirts", "Pants", "Shoes"],
      books: ["All", "Fiction", "Biography", "History", "Science"],
    };

    const categories = categoriesMap[product_id as keyof typeof categoriesMap];
    return categories;
  },
});
