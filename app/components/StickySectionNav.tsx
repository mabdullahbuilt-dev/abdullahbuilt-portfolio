"use client";

import { useEffect, useState } from "react";

// Links are server-rendered; the observer only adds the active-section highlight.
export default function StickySectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const sections = items.map(item => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "0px 0px -65% 0px" });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);
  return <nav className="ab-section-nav" aria-label="On this page">
    <strong>On this page</strong>
    <ol>{items.map((item, index) => <li key={item.id}><a href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}><small>{String(index + 1).padStart(2, "0")}</small>{item.label}</a></li>)}</ol>
  </nav>;
}
