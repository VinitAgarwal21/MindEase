import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Book, Sparkles, Lock, Calendar, ChevronRight, BarChart2, FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import TestimonialCarousel from "../components/TestimonialCarousel";
import FAQ from "../components/FAQ";
import faqs from "../data/faqs";

const features = [
  { icon: Book, title: "Rich Text Editor", description: "Express yourself with a powerful editor supporting markdown, formatting, and more." },
  { icon: Sparkles, title: "Daily Inspiration", description: "Get inspired with daily prompts and mood-based imagery to spark your creativity." },
  { icon: Lock, title: "Secure & Private", description: "Your thoughts are safe with enterprise-grade security and privacy features." },
];

export default function Home() {
  const [advice, setAdvice] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // later: fetch from backend /api/daily-prompt
    setAdvice("Take a deep breath and write one honest sentence.");
  }, []);

  return (
    <div className="relative container mx-auto px-4 pt-16 pb-16">
      {/* Hero */}
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl gradient-title mb-6 font-display font-bold">
          Your Space to Reflect. <br /> Your Story to Tell.
        </h1>
        <p className="text-lg md:text-xl text-mindease-700 mb-8">
          Capture your thoughts, track your moods, and reflect on your journey in a beautiful, secure space.
        </p>

        {/* Today's Entry Preview */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-mindease-50 via-transparent to-transparent pointer-events-none z-10" />
          <div className="bg-white rounded-2xl p-4 mx-auto shadow-md">
            <div className="border-b border-mindease-100 pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-mindease-500" />
                <span className="text-mindease-900 font-medium">Today’s Entry</span>
              </div>
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-mindease-200" />
                <div className="h-3 w-3 rounded-full bg-mindease-300" />
                <div className="h-3 w-3 rounded-full bg-mindease-400" />
              </div>
            </div>
            <div className="space-y-4 p-4">
              <h3 className="text-xl font-semibold text-mindease-900">"My Thoughts Today"</h3>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              {advice && (
                <div className="pt-2 text-sm text-mindease-600">
                  Prompt: <span className="font-medium">{advice}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex justify-center gap-4">
          <Link to="/dashboard">
            <Button className="px-8 py-6 rounded-full flex items-center gap-2 bg-mindease-500 text-white hover:bg-mindease-600">
              Start Writing <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
          <a href="#features">
            <Button className="px-8 py-6 rounded-full border border-mindease-500 text-mindease-600 hover:bg-mindease-100">
              Learn More
            </Button>
          </a>
        </div>
      </div>

      {/* Feature Cards */}
      <section id="features" className="mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <Card key={idx} className="shadow-lg p-6">
            <div className="h-12 w-12 bg-mindease-100 rounded-full flex items-center justify-center mb-4">
              <feature.icon className="h-6 w-6 text-mindease-500" />
            </div>
            <h3 className="font-semibold text-xl text-mindease-900 mb-2">{feature.title}</h3>
            <p className="text-mindease-700">{feature.description}</p>
          </Card>
        ))}
      </section>

      {/* Detailed Feature Sections */}
      <div className="space-y-24 mt-24">
        {/* Feature 1 */}
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="h-12 w-12 bg-mindease-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-mindease-500" />
            </div>
            <h3 className="text-2xl font-bold">Rich Text Editor</h3>
            <p className="text-lg text-mindease-700">
              Express yourself fully with our powerful editor featuring:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-mindease-400" />
                <span>Format text with ease</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-mindease-400" />
                <span>Embed links</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4 bg-white rounded-2xl shadow-xl p-6 border border-mindease-100">
            <div className="flex gap-2 mb-6">
              <div className="h-8 w-8 rounded bg-mindease-100"></div>
              <div className="h-8 w-8 rounded bg-mindease-100"></div>
              <div className="h-8 w-8 rounded bg-mindease-100"></div>
            </div>
            <div className="h-4 bg-mindease-50 rounded w-3/4"></div>
            <div className="h-4 bg-mindease-50 rounded w-full"></div>
            <div className="h-4 bg-mindease-50 rounded w-2/3"></div>
            <div className="h-4 bg-mindease-50 rounded w-1/3"></div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid md:grid-cols-2 gap-12 md:flex-row-reverse">
          <div className="space-y-6 md:order-2">
            <div className="h-12 w-12 bg-mindease-100 rounded-full flex items-center justify-center">
              <BarChart2 className="h-6 w-6 text-mindease-500" />
            </div>
            <h3 className="text-2xl font-bold">Mood Analytics</h3>
            <p className="text-lg text-mindease-700">
              Track your emotional journey with powerful analytics:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-mindease-400" />
                <span>Visual mood trends</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-mindease-400" />
                <span>Pattern recognition</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4 bg-white rounded-2xl shadow-xl p-6 border border-mindease-100">
            <div className="h-40 bg-mindease-50 rounded-md w-full"></div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <TestimonialCarousel />

      {/* FAQ */}
      <FAQ faqs={faqs} />

      {/* CTA */}
      <div className="mt-24">
        <Card className="bg-gradient-to-r from-mindease-100 to-accent-100 text-center p-12">
          <h2 className="text-3xl font-bold mb-6">
            Start Reflecting on Your Journey Today
          </h2>
          <p className="text-lg text-mindease-700 mb-8 max-w-2xl mx-auto">
            Join thousands who have already discovered the power of digital journaling.
          </p>
          <Button className="px-8 py-4 rounded-full bg-mindease-500 text-white hover:bg-mindease-600" onClick={() => {navigate("/auth")}}>
            Get Started for Free <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
