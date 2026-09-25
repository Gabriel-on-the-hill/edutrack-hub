'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';

// ═══════════════════════════════════════════════════════════════════════════════
// EDUTRACK HUB - Homepage
// A reference-quality EdTech landing page
// ═══════════════════════════════════════════════════════════════════════════════

import { Icons } from '@/components/ui/Icons';
import LeadMagnet from '@/components/marketing/LeadMagnet';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { getAllPosts } from '@/lib/mdx';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// INTRO VIDEO
// Host the intro video on YouTube or Vimeo (free, and it never touches Vercel
// storage), then paste the EMBED url below. Leave empty to show "coming soon".
//   YouTube embed:  https://www.youtube.com/embed/VIDEO_ID
//   Vimeo embed:    https://player.vimeo.com/video/VIDEO_ID
// ═══════════════════════════════════════════════════════════════════════════════

const INTRO_VIDEO_URL = '';

const VideoModal = ({ open, onClose, url }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Intro video"
    >
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 text-slate-800 flex items-center justify-center hover:bg-white transition-colors"
        >
          ✕
        </button>
        <iframe
          src={url}
          title="Intro video"
          className="w-full h-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView];
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Navigation logic removed (using global Navigation component)

// Hero Section
const Hero = () => {
  const [ref, isInView] = useInView();
  const [videoOpen, setVideoOpen] = useState(false);
  const hasVideo = Boolean(INTRO_VIDEO_URL);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} url={INTRO_VIDEO_URL} />
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] -translate-y-1/4 translate-x-1/4">
          <Icons.HeroBlob />
        </div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] translate-y-1/4 -translate-x-1/4 opacity-50">
          <Icons.HeroBlob />
        </div>
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 w-full">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-medium">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Mastery Hub: New Cohorts for All Levels
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Master the skills that{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-teal-600">shape your future.</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path
                    d="M0 9 Q 50 0, 100 9 T 200 9"
                    fill="none"
                    stroke="#14B8A6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-40"
                  />
                </svg>
              </span>
            </h1>

            {/* Sub-tagline */}
            <p className="text-lg sm:text-xl font-semibold text-slate-500 tracking-wide">
              Flexible learning. Measurable progress.
            </p>

            {/* Subheadline */}
            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
              From early foundations to advanced, exam-level work. Live, small-group tuition that closes gaps, builds genuine understanding, and helps you reach your goals.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/classes"
                className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
              >
                Find Your Class
                <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {hasVideo ? (
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  className="group inline-flex items-center justify-center gap-2 text-slate-700 hover:text-teal-600 px-6 py-4 font-semibold transition-colors"
                >
                  <span className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                    <Icons.Play className="w-4 h-4 ml-0.5" />
                  </span>
                  Watch a quick intro
                </button>
              ) : (
                <a
                  href="#how-it-works"
                  className="group inline-flex items-center justify-center gap-2 text-slate-700 hover:text-teal-600 px-6 py-4 font-semibold transition-colors"
                >
                  <span className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                    <Icons.ArrowRight className="w-4 h-4" />
                  </span>
                  See how it works
                </a>
              )}
            </div>

            {/* Trust Indicators — honest, founding-stage signals (no unverified stats) */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['bg-teal-200', 'bg-amber-200', 'bg-slate-300'].map((c, i) => (
                    <span key={i} className={`w-7 h-7 rounded-full ${c} ring-2 ring-white`} />
                  ))}
                </div>
                <span>Live online classes, worldwide</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icons.Users className="w-4 h-4 text-teal-500" />
                <span className="font-semibold text-slate-700">Small groups</span>
                <span>· max 8 students</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className={`relative transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Main Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-900/10 p-6 lg:p-8">
              {/* Video Preview */}
              <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {hasVideo ? (
                    <button
                      type="button"
                      onClick={() => setVideoOpen(true)}
                      className="text-center space-y-4 group"
                      aria-label="Play intro video"
                    >
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Icons.Play className="w-8 h-8 text-white ml-1" />
                      </div>
                      <p className="text-white/80 text-sm font-medium">Watch a quick intro</p>
                    </button>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                        <Icons.Play className="w-8 h-8 text-white/60 ml-1" />
                      </div>
                      <p className="text-white/60 text-sm font-medium">Intro video coming soon</p>
                    </div>
                  )}
                </div>
                {/* Label */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-teal-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  PREVIEW
                </div>
              </div>

              {/* Class Info */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">IGCSE Mathematics</h3>
                    <p className="text-sm text-slate-500">Quadratic Equations Mastery</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Icons.Users className="w-4 h-4" />
                    Small Group (Max 8)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icons.Check className="w-4 h-4 text-green-500" />
                    Interactive Whiteboard
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Elements — factual feature highlights */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <Icons.Users className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">Max 8</p>
                  <p className="text-xs text-slate-500">Students per class</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Icons.Check className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Recordings & notes</p>
                  <p className="text-xs text-slate-500">after every class</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// "For Students Who..." Section - Empathy-driven
const ForStudentsWho = () => {
  const [ref, isInView] = useInView();

  const struggles = [
    "You feel like you're learning, but can't apply the concepts when it counts.",
    "You've hit a plateau in your academic or professional progress.",
    "You want a clear path from the fundamentals through to mastery.",
    "You think you've reached your limit — when you've barely started.",
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div ref={ref} className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            Sound familiar?
          </h2>

          <div className="mt-12 space-y-4">
            {struggles.map((text, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl px-6 py-5 shadow-sm border border-slate-100 text-left flex items-start gap-4 transition-all duration-500 hover:shadow-md hover:border-teal-100 hover:-translate-y-0.5`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="mt-2 w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                <p className="text-lg text-slate-700">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>
            <div className="relative z-10">
              <p className="text-2xl sm:text-3xl font-semibold leading-snug">
                It's not about the "A".
                <br />
                <span className="text-teal-100">It's about the growth that gets you there.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// How It Works
const HowItWorks = () => {
  const [ref, isInView] = useInView();

  const steps = [
    {
      number: "01",
      title: "Find Your Class",
      description: "Browse our schedule for IGCSE, SAT, or A-Level sessions. Filter by subject and finding a time that fits.",
      icon: Icons.Calendar,
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "02",
      title: "Join the Live Session",
      description: "Log in and connect via Google Meet. It's interactive—ask questions, solve problems, and get instant feedback.",
      icon: Icons.Users,
      color: "from-teal-500 to-teal-600"
    },
    {
      number: "03",
      title: "Master the Topic",
      description: "Get the recording and notes immediately after class. Review until it clicks. See your skills transform.",
      icon: Icons.TrendingUp,
      color: "from-amber-500 to-amber-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-teal-600 font-semibold mb-3">Simple Process</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            From confused to confident
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`relative transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-slate-200 to-transparent -translate-x-8 z-0" />
              )}

              <div className="relative bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-transparent transition-all duration-300 group">
                <span className="absolute -top-4 -left-2 text-6xl font-bold text-slate-100 group-hover:text-teal-50 transition-colors select-none">
                  {step.number}
                </span>

                <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Learning Hubs Section
const LearningHubs = () => {
  const [ref, isInView] = useInView();

  const hubs = [
    {
      title: "Foundation Hub",
      subtitle: "Elementary & Middle",
      description: "Building the core logic and study habits that make future complex topics effortless.",
      icon: Icons.BookOpen, // Book for foundational learning
      color: "bg-blue-50 text-blue-700",
      link: "/hubs/foundation"
    },
    {
      title: "Success Hub",
      subtitle: "High School & SAT",
      description: "Strategic prep for IGCSE, SAT, and A-Levels. Turn exam anxiety into exam mastery.",
      icon: Icons.Star,
      color: "bg-teal-50 text-teal-700",
      link: "/hubs/success"
    },
    {
      title: "Elite Hub",
      subtitle: "Professional Mastery",
      description: "Advanced up-skilling and mentorship for professionals looking to dominate their field.",
      icon: Icons.TrendingUp,
      color: "bg-purple-50 text-purple-700",
      link: "/hubs/elite"
    },
    {
      title: "Partner Hub",
      subtitle: "Parents & Educators",
      description: "Resources and coordination tools to support the students in your care.",
      icon: Icons.Users,
      color: "bg-amber-50 text-amber-700",
      link: "/hubs/partner"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-teal-600 font-semibold mb-3">Choose Your Path</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            A pathway for every stage of learning
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hubs.map((hub, i) => (
            <Link key={i} href={hub.link}>
              <div
                className={`group h-full p-8 rounded-3xl border border-slate-100 transition-all duration-500 hover:shadow-xl hover:border-transparent cursor-pointer ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${hub.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <hub.icon className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold tracking-wider uppercase opacity-60 mb-2">{hub.subtitle}</p>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{hub.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {hub.description}
                </p>
                <span className="text-teal-600 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Enter Hub →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Programs Section
const Programs = () => {
  const [ref, isInView] = useInView();

  const programs = [
    { name: "IGCSE", description: "Cambridge International", subjects: ["Mathematics (0580)", "Physics (0625)", "Chemistry", "Add Maths"] },
    { name: "SAT Prep", description: "Digital SAT Strategy", subjects: ["Math (Module 1)", "Math (Module 2)", "Reading Strategy", "Writing & Language"] },
    { name: "A-Levels", description: "Advanced Mastery", subjects: ["Pure Math 1-3", "Mechanics", "Probability & Stats", "Physics"] },
    { name: "IB Diploma", description: "Standard & Higher Level", subjects: ["Math AA/AI", "Physics HL", "Chemistry HL"] },
    { name: "AP", description: "College Credit", subjects: ["Calculus AB/BC", "Physics C", "Statistics"] },
  ];

  return (
    <section id="programs" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-teal-400 font-semibold mb-3">Programs</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Expertise in every major curriculum
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {programs.map((program, i) => (
            <div
              key={i}
              className={`group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-teal-500/30 transition-all duration-300 cursor-pointer ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <h3 className="text-2xl font-bold text-white mb-1">{program.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{program.description}</p>
              <ul className="space-y-2">
                {program.subjects.slice(0, 3).map((subject, j) => (
                  <li key={j} className="text-sm text-slate-300 flex items-center gap-2">
                    <Icons.Check className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                    {subject}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`mt-16 text-center transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Explore All Classes
            <Icons.ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Our Approach — what students can expect (honest, founding-stage; no invented stats)
const OurApproach = () => {
  const [ref, isInView] = useInView();

  const pillars = [
    {
      icon: Icons.Users,
      title: "Live, small-group classes",
      description: "A maximum of 8 students per session, so every question gets answered and no one hides at the back.",
      color: "bg-teal-50 text-teal-700"
    },
    {
      icon: Icons.TrendingUp,
      title: "Strategy over memorisation",
      description: "We teach the methods and exam tactics that turn hard, unfamiliar problems into routine ones.",
      color: "bg-blue-50 text-blue-700"
    },
    {
      icon: Icons.Check,
      title: "Recordings, notes & feedback",
      description: "Every class comes with a recording, written notes, and personalised feedback you can revisit anytime.",
      color: "bg-amber-50 text-amber-700"
    }
  ];

  return (
    <section id="approach" className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-teal-600 font-semibold mb-3">Our Approach</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            Built to help you actually improve
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className={`bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-transparent transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${pillar.color} flex items-center justify-center mb-6`}>
                <pillar.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
              <p className="text-slate-600 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-500 mt-12 max-w-2xl mx-auto">
          We're a new, founder-led tutoring outfit — so you get senior attention from day one.
          Be one of our first students and help shape what EduTrack Hub becomes.
        </p>
      </div>
    </section>
  );
};

// Final CTA
const FinalCTA = () => {
  return (
    <section className="py-24 bg-teal-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <Icons.HeroBlob />
      </div>
      <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to get started?</h2>
        <p className="text-teal-100 text-xl mb-10 max-w-2xl mx-auto">
          Join an upcoming cohort. Places in each small-group class are limited.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/classes" className="bg-white text-teal-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-50 hover:scale-105 transition-all shadow-lg">
            Find Your Class
          </Link>
        </div>
      </div>
    </section>
  )
}

// Latest from the Blog
const LatestPosts = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-teal-600 font-semibold mb-3">Academic Excellence</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Latest Study Insights</h2>
          </div>
          <Link href="/blog" className="text-teal-600 font-bold hover:underline flex items-center gap-2">
            View all articles <Icons.ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="h-full bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300 flex flex-col">
                <div className="flex gap-2 mb-4">
                  {post.meta.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 bg-teal-50 text-teal-700 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors mb-3 line-clamp-2">
                  {post.meta.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">
                  {post.meta.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <span className="text-xs font-medium text-slate-400">{post.meta.date}</span>
                  <span className="text-sm font-bold text-teal-600">Read More →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>EduTrack Hub | Expert Math & Science Tutoring</title>
        <meta name="description" content="Master IGCSE, SAT, and A-Level Math & Science with Gabriel. Small group tutoring that delivers results." />
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>

      <style jsx global>{`
        html { scroll-behavior: smooth; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out 3s infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      <div className="bg-slate-50 min-h-screen">
        <Navigation transparent />
        <Hero />
        <ForStudentsWho />
        <HowItWorks />
        <LearningHubs />
        <LeadMagnet />
        <Programs />
        <OurApproach />
        <LatestPosts posts={posts} />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();
  return {
    props: {
      posts: posts.map(p => ({
        slug: p.slug,
        meta: p.meta
      }))
    }
  }
}
