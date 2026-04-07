import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Book, Sparkles, Lock, Calendar, ChevronRight, BarChart2, FileText, ArrowUpRight, ArrowUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import TestimonialCarousel from "../components/TestimonialCarousel";
import FAQ from "../components/FAQ";
import faqs from "../data/faqs";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: Book, title: "Rich Text Editor", description: "Express yourself with a powerful editor supporting markdown, formatting, and more." },
  { icon: Sparkles, title: "Daily Inspiration", description: "Get inspired with daily prompts and mood-based imagery to spark your creativity." },
  { icon: Lock, title: "Secure & Private", description: "Your thoughts are safe with enterprise-grade security and privacy features." },
];

export default function Home() {
  const [advice, setAdvice] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTherapist = user?.role === "therapist";

  const trustStats = isTherapist
    ? [
      { label: "Upcoming Sessions", value: "10+" },
      { label: "Mood-Aware Support", value: "24/7" },
      { label: "Client Safety Focus", value: "100%" },
    ]
    : [
      { label: "Guided Prompts", value: "365" },
      { label: "Private Journals", value: "100%" },
      { label: "Mood Insights", value: "24/7" },
    ];

  const quickActions = isTherapist
    ? [
      { title: "See appointments", href: "/therapist/appointments" },
      { title: "Update profile", href: "/therapist/profile/edit" },
      { title: "Start onboarding", href: "/therapist/onboarding" },
    ]
    : [
      { title: "Write journal", href: "/journalwrite" },
      { title: "Check emotion", href: "/emotionpredictor" },
      { title: "Find therapist", href: "/therapist" },
    ];

  useEffect(() => {
    // later: fetch from backend /api/daily-prompt
    setAdvice("Take a deep breath and write one honest sentence.");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setShowBackToTop(window.scrollY > 450);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative container mx-auto px-4 pb-16 pt-10 md:pt-14">
      <div className="pointer-events-none fixed left-0 top-0 z-50 h-1 bg-mindease-500 transition-all duration-200" style={{ width: `${scrollProgress}%` }} />
      <div className="pointer-events-none absolute -left-16 top-2 h-44 w-44 rounded-full bg-mindease-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-44 h-56 w-56 rounded-full bg-accent-100/45 blur-3xl" />

      {/* Hero */}
      <div className="animate-float-in mx-auto max-w-5xl space-y-6 sm:space-y-8 text-center">
        <span className="inline-flex items-center rounded-full border border-mindease-200 bg-white/70 px-4 py-1 text-sm font-medium text-mindease-700">
          Calm journaling for better mental clarity
        </span>
        <h1 className="gradient-title mb-6 font-display text-4xl sm:text-5xl font-bold md:text-7xl lg:text-8xl leading-tight">
          Your Space to Reflect. <br /> Your Story to Tell.
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-lg text-mindease-700 md:text-xl">
          Capture your thoughts, track your moods, and reflect on your journey in a beautiful, secure space.
        </p>

        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2 text-sm text-mindease-700">
          <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">Private by design</span>
          <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">Mood-aware insights</span>
          <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">Built for daily reflection</span>
        </div>

        {/* Today's Entry Preview */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-mindease-50 via-transparent to-transparent pointer-events-none z-10" />
          <div className="surface-card mx-auto rounded-2xl p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-mindease-100 pb-4">
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
            <div className="space-y-4 p-3 md:p-4">
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
        <div className="flex flex-wrap justify-center gap-4">
          {!isTherapist && (
            <Link to="/emotionpredictor">
              <Button className="flex items-center gap-2 rounded-full bg-mindease-500 px-8 py-4 text-white shadow-md hover:bg-mindease-600">
                Start Writing <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <a href="#features">
            <Button className="rounded-full border border-mindease-500 bg-white/80 px-8 py-4 text-mindease-600 hover:bg-mindease-100">
              Learn More
            </Button>
          </a>
        </div>
      </div>

      <section className="mt-12">
        <Card className="p-5 md:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {trustStats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-mindease-50/80 p-4 text-center ring-1 ring-mindease-100">
                <div className="text-2xl font-bold text-mindease-800">{stat.value}</div>
                <div className="mt-1 text-sm text-mindease-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-8">
        <div className="grid gap-3 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Card className="group h-full p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-mindease-800">{action.title}</span>
                  <ArrowUpRight className="h-4 w-4 text-mindease-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section id="features" className="mt-16 sm:mt-24 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => (
          <Card key={idx} className="group p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-mindease-100 transition group-hover:bg-mindease-200">
              <feature.icon className="h-6 w-6 text-mindease-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-mindease-900">{feature.title}</h3>
            <p className="text-mindease-700">{feature.description}</p>
          </Card>
        ))}
      </section>

      {/* Detailed Feature Sections */}
      <div className="space-y-16 sm:space-y-24 mt-16 sm:mt-24">
        {/* Feature 1 */}
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
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
          <div className="surface-card space-y-4 rounded-2xl p-6">
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
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
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
          <div className="surface-card space-y-4 rounded-2xl p-6">
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
        <Card className="bg-gradient-to-r from-mindease-100 to-accent-100 p-10 text-center md:p-12">
          <h2 className="text-3xl font-bold mb-6">
            {isTherapist ? "Look at your schedule" : "Start Reflecting on Your Journey Today"}
          </h2>
          <p className="text-lg text-mindease-700 mb-8 max-w-2xl mx-auto">
            {isTherapist
              ? "Stay on top of your upcoming sessions and manage your day with clarity."
              : "Join thousands who have already discovered the power of digital journaling."}
          </p>
          <Button
            className="rounded-full bg-mindease-500 px-8 py-4 text-white hover:bg-mindease-600"
            onClick={() => {
              navigate(isTherapist ? "/therapist/appointments" : "/auth");
            }}
          >
            {isTherapist ? "Look up" : "Get Started for Free"} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </div>

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="focus-outline fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-mindease-600 text-white shadow-lg transition hover:bg-mindease-700"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
