import {
  Link,
  Outlet,
  Route,
  redirect,
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import { root } from "./root";
import { z } from "zod";
import { motion } from "framer-motion";
import { memo, useEffect } from "react";

const IndexComponent = () => {
  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col gap-3 pt-8 items-center">
      <RouteStatus />
      <div className="bg-zinc-900 container max-w-3xl rounded-lg border border-zinc-600 p-6 ">
        <Outlet />
      </div>
    </div>
  );
};

function Lock() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 11V8A5 5 0 007 8v3m1.8 10h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C20 18.72 20 17.88 20 16.2v-.4c0-1.68 0-2.52-.327-3.162a3 3 0 00-1.311-1.311C17.72 11 16.88 11 15.2 11H8.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C4 13.28 4 14.12 4 15.8v.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C6.28 21 7.12 21 8.8 21z"
      ></path>
    </svg>
  );
}

const RouteStatus = () => {
  // const router = useRouter();

  const product_id = useParams({
    from: "/app/$product_id/$category_id",
    select(search) {
      return search.product_id;
    },
  });

  const category_id = useParams({
    from: "/app/$product_id/$category_id",
    select(search) {
      return search.category_id;
    },
  });

  const product_count = useSearch({
    from: "/",
    select: (search) => search.product_count,
  });

  const category_count = useSearch({
    from: "/",
    select: (search) => search.category_count,
  });

  // const category_count = appRoute.useSearch({
  //   select: (search) => search.category_count,
  // });

  // useEffect(() => {
  //   const unsub = router.subscribe("onBeforeLoad", (p) => {
  //     console.log("onBeforeLoad", p);
  //   });

  //   return () => unsub();
  // }, [router]);

  return (
    <div className="h-10 bg-zinc-900 rounded-lg container border border-zinc-600 max-w-3xl flex items-center p-4 text-sm text-zinc-400 font-medium">
      <div className="text-zinc-500">
        <Lock />
      </div>
      <div className="pl-2">acme.com</div>
      <div className="text-zinc-500 pl-1">/</div>
      <div className="pl-1">app</div>
      <div className="text-zinc-500 pl-1">/</div>
      <RouteLabel key={product_id} label={product_id} />
      <div className="text-zinc-500 pl-1">/</div>
      <RouteLabel key={category_id} label={category_id} />
      <div className="text-zinc-500 pl-1">?</div>
      <RouteLabel
        key={product_count}
        label={`product_count = ${product_count}`}
      />

      <div className="text-zinc-500 pl-1">&</div>
      <RouteLabel
        key={category_count}
        label={`category_count = ${category_count}`}
      />
    </div>
  );
};

const RouteLabel = ({ label }: { label: string }) => {
  return (
    <motion.div
      initial={{
        color: "rgb(74 222 128)",
      }}
      animate={{
        color: "rgb(161 161 170)",
      }}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
      }}
      className="px-1 ml-1 rounded"
    >
      {label}
    </motion.div>
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
        borderColor: "rgb(74 222 128)",
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
                // @ts-expect-error sjnsak
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
  const params = useParams({
    from: "/app/$product_id/$category_id",
    select: (params) => {
      return params.product_id;
    },
  });
  const navigate = useNavigate();

  productReRenderCount++;

  return (
    <div className="text-zinc-400 relative mt-4">
      <Label label="Categories" key={productReRenderCount} />
      <div className="py-4 text-sm flex justify-between items-center px-2">
        <div className="flex gap-2">
          {data.map((category) => {
            return (
              <Link
                key={category}
                to="/app/$product_id/$category_id"
                className="px-3 rounded text-sm py-1 transition duration-200"
                inactiveProps={{
                  className: "hover:bg-zinc-800",
                }}
                activeProps={{
                  className: "text-green-400 bg-green-900/30",
                }}
                params={{
                  product_id: params,
                  category_id: category.toLowerCase(),
                }}
                // @ts-expect-error sjnsak
                search={(s) => ({ ...s })}
              >
                {category}
              </Link>
            );
          })}
        </div>
        <button
          className="text-sm border tabular-nums border-zinc-700 bg-zinc-800 py-0.5 px-2 rounded hover:border-green-600 transition-colors duration-200"
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
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

const ProductComponentMemo = memo(ProductComponent);

export const productRoute = new Route({
  getParentRoute: () => appRoute,
  path: "$product_id",
  component: ProductComponentMemo,
  beforeLoad: (p) => {
    const segments = p.location.pathname.split("/");

    if (segments.length !== 4) {
      throw redirect({
        to: "/app/$product_id/$category_id",
        params: {
          product_id: segments[2],
          category_id: "all",
        },
        search: { ...p.search },
      });
    }
  },
  loader: async ({ params }) => {
    // await new Promise((resolve) => setTimeout(resolve, 200));
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

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

let categoryReRenderCount = 0;

const CategoryComponent = () => {
  const data = categoryRoute.useLoaderData();
  const category = categoryRoute.useParams({
    select(search) {
      return search.category_id;
    },
  });

  categoryReRenderCount++;

  return (
    <div className="text-sm relative">
      <Label label={capitalize(category)} key={categoryReRenderCount} />
      <div className="py-4 px-2 grid grid-cols-3 gap-4">
        {Array.from({ length: data }).map((_, i) => {
          return (
            <div
              key={i}
              className="bg-zinc-800 rounded-md p-3 flex flex-col gap-1.5"
            >
              <div className="text-zinc-400 bg-zinc-900 h-20 w-full rounded"></div>
              <div className="text-zinc-400 h-4 w-4/5 bg-zinc-900 rounded-full"></div>
              <div className="text-zinc-400 h-4 w-1/2 bg-zinc-900 rounded-full"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CategoryMemo = memo(CategoryComponent);

const data = {
  electronics: {
    all: 8,
    phones: 4,
    laptops: 1,
    tablets: 3,
  },
  clothing: {
    all: 6,
    shirts: 4,
    pants: 1,
    shoes: 1,
  },
  books: {
    all: 10,
    fiction: 3,
    biography: 4,
    history: 2,
    science: 1,
  },
};

export const categoryRoute = new Route({
  getParentRoute: () => productRoute,
  path: "$category_id",
  component: CategoryMemo,
  loader: async ({ params }) => {
    const { category_id, product_id } = params;

    // @ts-expect-error shasbhjhj
    return data[product_id][category_id];
  },
});
