"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

// Accessible tabs (WAI-ARIA pattern). Every panel is server-rendered; inactive panels use `hidden`.
export default function Tabs({ label, tabs, className = "" }: { label: string; tabs: { id: string; label: ReactNode; panel: ReactNode }[]; className?: string }) {
  const base = useId();
  const [selected, setSelected] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    const next = event.key === "ArrowRight" || event.key === "ArrowDown" ? (index === last ? 0 : index + 1) : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (index === 0 ? last : index - 1) : event.key === "Home" ? 0 : event.key === "End" ? last : -1;
    if (next < 0) return;
    event.preventDefault();
    setSelected(next);
    refs.current[next]?.focus();
  };
  return <div className={`tabs ${className}`}>
    <div role="tablist" aria-label={label} className="tabs__list">
      {tabs.map((tab, index) => <button key={tab.id} ref={node => { refs.current[index] = node; }} type="button" role="tab" id={`${base}-tab-${tab.id}`} aria-controls={`${base}-panel-${tab.id}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => move(event, index)} className="tabs__tab">{tab.label}</button>)}
    </div>
    {tabs.map((tab, index) => <div key={tab.id} role="tabpanel" id={`${base}-panel-${tab.id}`} aria-labelledby={`${base}-tab-${tab.id}`} hidden={selected !== index} tabIndex={0} className="tabs__panel">{tab.panel}</div>)}
  </div>;
}
