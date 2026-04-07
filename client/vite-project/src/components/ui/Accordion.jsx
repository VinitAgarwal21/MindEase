import { useState } from "react";

export function Accordion({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function AccordionItem({ value, children, className = "" }) {
  return <div className={`rounded-xl border border-mindease-100 bg-white/80 px-4 md:px-5 ${className}`}>{children}</div>;
}

export function AccordionTrigger({ children, onClick, open }) {
  return (
    <button
      onClick={onClick}
      className="focus-outline flex w-full items-center justify-between py-4 text-left font-medium"
    >
      {children}
      <span className="ml-4 text-xl leading-none text-mindease-600">{open ? "−" : "+"}</span>
    </button>
  );
}

export function AccordionContent({ open, children }) {
  return (
    <div className={`pb-4 text-mindease-700 ${open ? "block" : "hidden"}`}>
      {children}
    </div>
  );
}
