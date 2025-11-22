"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function Section(props: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={props.id}
      className="scroll-section mx-auto mt-12 max-w-6xl px-4 scroll-mt-28 sm:mt-20 sm:scroll-mt-32 lg:mt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3, once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-xl tracking-tight text-slate-50 sm:text-2xl">
          {props.title}
        </h2>
        <div className="mt-4 border-t border-slate-800/70" />
        <div className="mt-6">
          {props.children}
        </div>
      </motion.div>
    </section>
  );
}
