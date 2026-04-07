import { useEffect, useState } from "react";

const TESTIMONIALS = [
  { name: "Aarav", text: "MindEase helped me build a daily journaling habit." },
  { name: "Isha", text: "Mood analytics gave me patterns I couldn’t see before." },
  { name: "Rohan", text: "The AI coach is such a great reflection partner!" },
];

export default function TestimonialCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % TESTIMONIALS.length), 3500);
    return () => clearInterval(id);
  }, []);

  const t = TESTIMONIALS[i];

  return (
    <div className="mt-24 max-w-3xl mx-auto text-center">
      <div className="surface-card rounded-2xl p-8 md:p-10">
        <p className="text-lg md:text-xl text-mindease-700">“{t.text}”</p>
        <div className="mt-5 font-semibold text-mindease-900">— {t.name}</div>
        <div className="mt-5 flex justify-center gap-2">
          {TESTIMONIALS.map((_, idx) => (
            <span
              key={idx}
              className={`h-2.5 w-2.5 rounded-full transition ${i === idx ? "bg-mindease-600" : "bg-mindease-200"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
