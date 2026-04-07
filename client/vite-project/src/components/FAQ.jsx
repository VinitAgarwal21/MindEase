import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/Accordion";

export default function FAQ({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mt-24">
      <h2 className="mb-3 text-center text-3xl font-bold">Frequently Asked Questions</h2>
      <p className="mx-auto mb-10 max-w-2xl text-center text-mindease-700">
        Everything you need to know before getting started with MindEase.
      </p>
      <Accordion className="mx-auto grid max-w-3xl gap-3">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger open={openIndex === i} onClick={() => setOpenIndex(openIndex === i ? null : i)}>
              <span className="text-lg">{faq.q}</span>
            </AccordionTrigger>
            <AccordionContent open={openIndex === i}>
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
