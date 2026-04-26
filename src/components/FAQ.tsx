"use client";

import { useState } from "react";

type Item = { q: string; a: string };

function FAQItem({ q, a }: Item) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-[17px] tracking-[-0.01em]">{q}</span>
        <span
          className={`text-[24px] leading-none transition-transform duration-300 ease-out ${open ? "rotate-45" : ""}`}
          style={{ color: "#A892FF" }}
          aria-hidden
        >
          +
        </span>
      </button>
      {/* CSS Grid trick: animating grid-template-rows from 0fr to 1fr smoothly
          reveals the inner content's natural height. The inner div needs
          overflow:hidden so content doesn't visibly clip outside its row. */}
      <div
        className="grid transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          marginTop: open ? "1rem" : "0rem",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <p className="text-[color:var(--muted-soft)] leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ({ items }: { items: Item[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <FAQItem key={item.q} {...item} />
      ))}
    </div>
  );
}
