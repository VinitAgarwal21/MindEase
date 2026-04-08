import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Book, Sparkles, Lock, Calendar, ChevronRight, BarChart2, FileText,
  ArrowUpRight, ArrowUp, PenLine, Brain, Heart, Shield, TrendingUp,
  MessageCircleHeart, Smile, Users,
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
  {
    icon: Book,
    title: "Rich Text Editor",
    description: "Express yourself with a powerful editor supporting markdown, formatting, and more.",
    gradient: "from-mindease-400 to-mindease-600",
  },
  {
    icon: Sparkles,
    title: "Daily Inspiration",
    description: "Get inspired with daily prompts and mood-based imagery to spark your creativity.",
    gradient: "from-accent-300 to-accent-500",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description: "Your thoughts are safe with enterprise-grade security and privacy features.",
    gradient: "from-mindease-500 to-accent-300",
  },
];

const QUICK_ACTION_ICONS = {
  "Write journal": PenLine,
  "Check emotion": Brain,
  "Find therapist": Heart,
  "See appointments": Calendar,
  "Update profile": Users,
  "Start onboarding": TrendingUp,
};

const STAT_ICONS = {
  "Guided Prompts": MessageCircleHeart,
  "Private Journals": Shield,
  "Mood Insights": TrendingUp,
  "Upcoming Sessions": Calendar,
  "Mood-Aware Support": Brain,
  "Client Safety Focus": Shield,
};

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
      { title: "See appointments", href: "/therapist/appointments", desc: "View and manage your schedule" },
      { title: "Update profile", href: "/therapist/profile/edit", desc: "Keep your credentials up to date" },
      { title: "Start onboarding", href: "/therapist/onboarding", desc: "Complete your therapist setup" },
    ]
    : [
      { title: "Write journal", href: "/journalwrite", desc: "Capture your thoughts and feelings" },
      { title: "Check emotion", href: "/emotionpredictor", desc: "AI-powered emotion analysis" },
      { title: "Find therapist", href: "/therapist", desc: "Connect with a professional" },
    ];

  useEffect(() => {
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
      {/* Scroll progress */}
      <div
        className="pointer-events-none fixed left-0 top-0 z-50 h-1 bg-gradient-to-r from-mindease-500 to-accent-500 transition-all duration-200"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Background blobs */}
      <div className="pointer-events-none absolute -left-16 top-2 h-44 w-44 rounded-full bg-mindease-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-44 h-56 w-56 rounded-full bg-accent-100/45 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-96 h-40 w-40 -translate-x-1/2 rounded-full bg-mindease-300/20 blur-3xl" />

      {/* ══════════════════════════════════════════
          HERO
         ══════════════════════════════════════════ */}
      <div className="animate-float-in mx-auto max-w-5xl space-y-6 sm:space-y-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-mindease-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-mindease-700 shadow-sm">
          <Smile className="w-4 h-4" />
          Calm journaling for better mental clarity
        </span>

        <h1 className="gradient-title mb-6 font-display text-4xl sm:text-5xl font-bold md:text-7xl lg:text-8xl leading-tight">
          Your Space to Reflect. <br /> Your Story to Tell.
        </h1>

        <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600 md:text-xl leading-relaxed">
          Capture your thoughts, track your moods, and reflect on your journey in a beautiful, secure space designed for your mental well-being.
        </p>

        {/* Badges */}
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2 text-sm text-mindease-700">
          {["Private by design", "Mood-aware insights", "Built for daily reflection"].map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-white/80 px-4 py-1.5 shadow-sm border border-mindease-100 font-medium"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Today's Entry Preview */}
        <div className="relative mt-8">
          <div className="absolute inset-0 bg-gradient-to-t from-mindease-50 via-transparent to-transparent pointer-events-none z-10" />
          <div className="surface-card mx-auto rounded-2xl p-4 md:p-6 max-w-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-mindease-100 pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-mindease-500" />
                <span className="text-gray-800 font-medium">Today's Entry</span>
              </div>
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-mindease-200" />
                <div className="h-3 w-3 rounded-full bg-mindease-300" />
                <div className="h-3 w-3 rounded-full bg-mindease-400" />
              </div>
            </div>
            <div className="space-y-4 p-3 md:p-4">
              <h3 className="text-xl font-semibold text-gray-800">"My Thoughts Today"</h3>
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
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {!isTherapist && (
            <Link to="/emotionpredictor">
              <Button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-mindease-500 to-accent-500 px-8 py-4 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]">
                <Sparkles className="h-5 w-5" /> Start Writing <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <a href="#features">
            <Button className="rounded-full border border-mindease-300 bg-white/80 px-8 py-4 text-mindease-600 hover:bg-mindease-100 shadow-sm">
              Learn More
            </Button>
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          TRUST STATS
         ══════════════════════════════════════════ */}
      <section className="mt-14">
        <Card className="p-5 md:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {trustStats.map((stat) => {
              const StatIcon = STAT_ICONS[stat.label] || Sparkles;
              return (
                <div key={stat.label} className="rounded-xl bg-mindease-50/80 p-5 text-center ring-1 ring-mindease-100 hover:ring-mindease-300 transition-all duration-200">
                  <StatIcon className="w-6 h-6 text-mindease-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-mindease-800">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* ══════════════════════════════════════════
          QUICK ACTIONS
         ══════════════════════════════════════════ */}
      <section className="mt-8">
        <div className="grid gap-3 md:grid-cols-3">
          {quickActions.map((action) => {
            const ActionIcon = QUICK_ACTION_ICONS[action.title] || ArrowUpRight;
            return (
              <Link key={action.title} to={action.href}>
                <Card className="group h-full p-5 transition duration-200 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-mindease-100 flex items-center justify-center flex-shrink-0 group-hover:bg-mindease-200 transition">
                      <ActionIcon className="h-5 w-5 text-mindease-600" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800">{action.title}</span>
                        <ArrowUpRight className="h-4 w-4 text-mindease-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURE CARDS
         ══════════════════════════════════════════ */}
      <section id="features" className="mt-16 sm:mt-24 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => (
          <Card key={idx} className="group p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${feature.gradient} transition shadow-md`}>
              <feature.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
          </Card>
        ))}
      </section>

      {/* ══════════════════════════════════════════
          DETAILED FEATURE SECTIONS
         ══════════════════════════════════════════ */}
      <div className="space-y-16 sm:space-y-24 mt-16 sm:mt-24">
        {/* Feature 1 — Rich Text Editor */}
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <div className="h-12 w-12 bg-gradient-to-br from-mindease-400 to-mindease-600 rounded-full flex items-center justify-center shadow-md">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Rich Text Editor</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Express yourself fully with our powerful editor featuring:
            </p>
            <ul className="space-y-3">
              {["Format text with bold, italic, and headings", "Add links and structured lists", "Beautiful, distraction-free writing space"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-mindease-400 to-accent-500 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card space-y-4 rounded-2xl p-6">
            <div className="flex gap-2 mb-6">
              {["B", "I", "U"].map((btn) => (
                <div key={btn} className="h-8 w-8 rounded bg-mindease-100 flex items-center justify-center text-xs font-bold text-mindease-600">{btn}</div>
              ))}
              <div className="h-8 w-8 rounded bg-mindease-100 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-mindease-600" />
              </div>
            </div>
            <div className="h-4 bg-mindease-100/60 rounded w-3/4" />
            <div className="h-4 bg-mindease-100/60 rounded w-full" />
            <div className="h-4 bg-mindease-100/60 rounded w-2/3" />
            <div className="h-4 bg-mindease-100/40 rounded w-1/3" />
          </div>
        </div>

        {/* Feature 2 — Mood Analytics */}
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="space-y-6 md:order-2">
            <div className="h-12 w-12 bg-gradient-to-br from-accent-300 to-accent-500 rounded-full flex items-center justify-center shadow-md">
              <BarChart2 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Mood Analytics</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Track your emotional journey with powerful analytics:
            </p>
            <ul className="space-y-3">
              {["Visual mood trends over time", "Detect emotional patterns", "Insights to support your growth"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-accent-300 to-mindease-500 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card rounded-2xl p-6">
            {/* Mini bar chart visualization */}
            <div className="flex items-end justify-between gap-2 h-40 px-4">
              {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-mindease-500 to-accent-300 transition-all duration-500"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-gray-400">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
         ══════════════════════════════════════════ */}
      <TestimonialCarousel />

      {/* ══════════════════════════════════════════
          FAQ
         ══════════════════════════════════════════ */}
      <FAQ faqs={faqs} />

      {/* ══════════════════════════════════════════
          CTA
         ══════════════════════════════════════════ */}
      <div className="mt-24">
        <Card className="relative overflow-hidden bg-gradient-to-r from-mindease-100 to-accent-100 p-10 text-center md:p-12">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 h-40 w-40 bg-mindease-300/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 bg-accent-300/30 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              {isTherapist ? "Look at your schedule" : "Start Reflecting on Your Journey Today"}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {isTherapist
                ? "Stay on top of your upcoming sessions and manage your day with clarity."
                : "Join thousands who have already discovered the power of digital journaling for mental well-being."}
            </p>
            <Button
              className="rounded-full bg-gradient-to-r from-mindease-500 to-accent-500 px-8 py-4 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
              onClick={() => {
                navigate(isTherapist ? "/therapist/appointments" : "/auth");
              }}
            >
              {isTherapist ? "Look up" : "Get Started for Free"} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="focus-outline fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-mindease-500 to-accent-500 text-white shadow-lg transition hover:shadow-xl hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
