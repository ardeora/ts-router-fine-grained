import { Route } from "@tanstack/react-router";
import { productRoute } from "../$product_id";
import { Label } from "../../../components/Label";
import { memo } from "react";

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
} as Record<string, Record<string, number>>;

const CategoryMemo = memo(CategoryComponent);

export const categoryRoute = new Route({
  getParentRoute: () => productRoute,
  path: "$category_id",
  component: CategoryMemo,
  loader: async ({ params }) => {
    const { category_id, product_id } = params;

    return data[product_id][category_id];
  },
});
