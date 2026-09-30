"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Content is fully visible by default (no JS, reduced motion, already on screen).
// Only when the block starts below the fold does it hold a "pending" state, then plays once.
export default function SequenceReveal({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    if (node.getBoundingClientRect().top < window.innerHeight * 0.85) return;
    node.dataset.seq = "pending";
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      node.dataset.seq = "run";
      observer.disconnect();
    }, { rootMargin: "0px 0px -18% 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <Tag ref={ref as never} className={className}>{children}</Tag>;
}
