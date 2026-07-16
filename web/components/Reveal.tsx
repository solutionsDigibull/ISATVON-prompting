"use client";

import { motion, useReducedMotion } from "motion/react";

// Scroll-reveal fade-up. Children stay server-rendered; this only animates the wrapper.
// Never wrap H1/H2/SEO-critical copy: content inside starts at opacity 0 until in view.
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      // ponytail: "some" (any pixel visible) instead of a numeric ratio — tall
      // grids can never reach even 10% intersection, leaving them stuck at opacity 0
      viewport={{ once: true, amount: "some" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
