"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

interface StaggerChildrenProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  style?: CSSProperties;
}

const container = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: { staggerChildren: staggerDelay },
  }),
};

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  className,
  style,
}: StaggerChildrenProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={staggerDelay}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
