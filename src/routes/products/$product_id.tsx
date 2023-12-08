import {
  Link,
  Outlet,
  Route,
  redirect,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { appRoute } from "..";
import { Label } from "../../components/Label";
import { memo } from "react";

let productReRenderCount = 0;
export const ProductComponent = () => {
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

const ProductMemo = memo(ProductComponent);

export const productRoute = new Route({
  getParentRoute: () => appRoute,
  path: "$product_id",
  component: ProductMemo,
  beforeLoad: (p) => {
    // Feeling lazy, so we'll just redirect to the first category
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
