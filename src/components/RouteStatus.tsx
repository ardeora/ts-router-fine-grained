import { useParams, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { appRoute } from "../routes";

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

export const RouteStatus = () => {
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
    from: appRoute.to,
    select: (search) => search.product_count,
  });

  const category_count = useSearch({
    from: appRoute.to,
    select: (search) => search.category_count,
  });

  return (
    <div className="h-10 bg-zinc-900 rounded-lg container border border-zinc-600 max-w-3xl flex items-center p-4 text-sm text-zinc-400 font-medium">
      <div className="text-zinc-500">
        <Lock />
      </div>
      <div className="pl-2">acme.com</div>
      <div className="text-zinc-500 pl-1">/</div>
      <div className="pl-1">app</div>
      <div className="text-zinc-500 pl-1">/</div>
      <RouteLabel key={`${product_id}-product_id`} label={product_id} />
      <div className="text-zinc-500 pl-1">/</div>
      <RouteLabel key={`${category_id}-category_id`} label={category_id} />
      <div className="text-zinc-500 pl-1">?</div>
      <RouteLabel
        key={`${product_count}-product_count`}
        label={`product_count = ${product_count}`}
      />

      <div className="text-zinc-500 pl-1">&</div>
      <RouteLabel
        key={`${category_count}-category_count`}
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
