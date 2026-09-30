"use client";

import { useEffect, useRef, useState } from "react";

// Server-rendered links; the client adds the active section, reading progress, and mobile collapse.
export default function GuideToc({ items, articleId }: { items: { id: string; label: string }[]; articleId: string }) {
  const [active, setActive] = useState("");
  const [progress, setProgress] = useState(0);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    // Without JS the list stays open in the flow. With JS on small screens it becomes a collapsed sticky bar.
    if (navRef.current) navRef.current.dataset.ready = "true";
    if (detailsRef.current && window.matchMedia("(max-width: 980px)").matches) detailsRef.current.open = false;
  }, []);
  useEffect(() => {
    const sections = items.map(item => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    const article = document.getElementById(articleId);
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      setActive(sections.filter(section => section.getBoundingClientRect().top <= line).pop()?.id ?? "");
      if (article) {
        const rect = article.getBoundingClientRect();
        const total = rect.height - window.innerHeight * 0.6;
        setProgress(Math.min(1, Math.max(0, -rect.top / Math.max(total, 1))));
      }
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, [items, articleId]);
  const current = items.findIndex(item => item.id === active);
  return <nav ref={navRef} className="toc" aria-label="On this page">
    <details ref={detailsRef} className="toc__details" open>
      <summary className="toc__summary">
        <span>On this page</span>
        <span className="toc__current" aria-hidden="true">{current >= 0 ? `${String(current + 1).padStart(2, "0")} · ${items[current].label}` : `${items.length} sections`}</span>
      </summary>
      <ol>{items.map((item, index) => <li key={item.id}><a href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined} onClick={() => { if (window.matchMedia("(max-width: 980px)").matches && detailsRef.current) detailsRef.current.open = false; }}><small>{String(index + 1).padStart(2, "0")}</small>{item.label}</a></li>)}</ol>
    </details>
    <div className="toc__progress" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><i style={{ transform: `scaleX(${progress})` }} /></div>
  </nav>;
}
