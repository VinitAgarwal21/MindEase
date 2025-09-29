import { useState } from "react";

export function Accordion({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function AccordionItem({ value, children, className = "" }) {
  return <div className={`border-b ${className}`}>{children}</div>;
}

export function AccordionTrigger({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left py-4 font-medium flex items-center justify-between"
    >
      {children}
      <span className="ml-4 text-xl leading-none">+</span>
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
