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
      className="scroll-section mx-auto mt-24 max-w-6xl px-6 sm:mt-32 lg:mt-40"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.2, once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl drop-shadow-md">
          {props.title}
        </h2>
        <div className="mt-8 mb-12 h-px w-full max-w-xs bg-gradient-to-r from-sky-500/50 to-transparent" />
        
        <div className="relative">
            {props.children}
        </div>
      </motion.div>
    </section>
  );
}
