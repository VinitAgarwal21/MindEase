import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/Accordion";

export default function FAQ({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mt-24">
      <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
      <Accordion className="max-w-3xl mx-auto">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger onClick={() => setOpenIndex(openIndex === i ? null : i)}>
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
