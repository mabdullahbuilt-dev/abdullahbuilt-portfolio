"use client";

/*
 * Adapted from React Bits SpotlightCard (https://reactbits.dev, MIT + Commons Clause, © David Haz).
 * Changes: AbdullahBuilt tokens, keyboard focus support, no inline colour prop, reduced-motion aware CSS.
 */
import { useRef, type MouseEvent, type ReactNode } from "react";

export default function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const track = (event: MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };
  return <div ref={ref} onMouseMove={track} className={`ab-spotlight ${className}`}>{children}</div>;
}
