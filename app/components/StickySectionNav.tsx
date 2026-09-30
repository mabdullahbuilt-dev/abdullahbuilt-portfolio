"use client";

import { useEffect, useState } from "react";

// Links are server-rendered; the observer only adds the active-section highlight.
export default function StickySectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const sections = items.map(item => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    let frame = 0;
    // Active = the last section whose top has passed 30% of the viewport.
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      const current = sections.filter(section => section.getBoundingClientRect().top <= line).pop();
      setActive(current?.id ?? "");
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, [items]);
  return <nav className="ab-section-nav" aria-label="On this page">
    <strong>On this page</strong>
    <ol>{items.map((item, index) => <li key={item.id}><a href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}><small>{String(index + 1).padStart(2, "0")}</small>{item.label}</a></li>)}</ol>
  </nav>;
}
