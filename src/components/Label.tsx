import { motion } from "framer-motion";

export const Label = ({ label }: { label: string }) => {
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
