"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

type AnimatedCounterProps = {
  to: number;
  suffix?: string;
};

export function AnimatedCounter({ to, suffix = "" }: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  const isInView = useInView(nodeRef, {
    once: true,
    margin: "-40px 0px",
  });

  useEffect(() => {
    if (!isInView || !nodeRef.current) return;

    const node = nodeRef.current;

    const controls = animate(0, to, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = `${Math.round(value).toLocaleString()}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [isInView, suffix, to]);

  return <span ref={nodeRef}>0{suffix}</span>;
}