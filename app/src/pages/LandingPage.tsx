
'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  PenLine,
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Feather,
  Globe,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { useGetCurrentUserQuery } from "@/lib/generated";
import { useRef } from 'react';
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';



const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }
});

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } }
};



const InkwellLogo = ({ className = "w-10 h-10", ariaLabel = "Inkwell logo" }: { className?: string; ariaLabel?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label={ariaLabel}
    role="img"
  >
    <motion.path
      d="M50 10 C30 10, 15 25, 15 45 C15 65, 30 80, 50 80 C70 80, 85 65, 85 45 C85 25, 70 10, 50 10Z"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
    <motion.path
      d="M50 80 L50 95"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 1.5 }}
    />
    <motion.path
      d="M35 95 L65 95"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 2 }}
    />
    <motion.path
      d="M50 35 L50 55 M40 45 L60 45"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 2.5 }}
    />
  </svg>
);



const FEATURES = [
  {
    icon: <PenLine className="w-5 h-5" aria-hidden="true" />,
    title: "Expressive Writing",
    description: "Rich editor with markdown, threads, and formatting built for storytellers."
  },
  {
    icon: <ImageIcon className="w-5 h-5" aria-hidden="true" />,
    title: "Visual Stories",
    description: "Share up to 4 images per post with built-in editing and alt-text support."
  },
  {
    icon: <Heart className="w-5 h-5" aria-hidden="true" />,
    title: "Meaningful Engagement",
    description: "Like, reply, repost, and quote — interactions that build real community."
  },
  {
    icon: <TrendingUp className="w-5 h-5" aria-hidden="true" />,
    title: "Discover Trends",
    description: "Curated feeds, trending topics, and hashtags tailored to your interests."
  },
  {
    icon: <Users className="w-5 h-5" aria-hidden="true" />,
    title: "Communities",
    description: "Join or create spaces around poetry, photography, tech, and more."
  },
  {
    icon: <Zap className="w-5 h-5" aria-hidden="true" />,
    title: "Lightning Fast",
    description: "Instant loading, real-time updates, and smooth scrolling on every device."
  }
];

const STATS = [
  { value: "2M+", label: "Active Writers" },
  { value: "50M+", label: "Posts Shared" },
  { value: "100K+", label: "Communities" },
  { value: "190", label: "Countries" }
];

const TESTIMONIALS = [
  {
    quote: "Inkwell transformed how I share my poetry. The community here actually reads and engages deeply.",
    author: "Elena Rodriguez",
    handle: "@elenawrites",
    role: "Poet & Author"
  },
  {
    quote: "The image sharing is seamless. I post my photography alongside stories and the quality retention is perfect.",
    author: "Marcus Johnson",
    handle: "@marcuslens",
    role: "Photographer"
  },
  {
    quote: "Finally, a platform that respects writers. No algorithmic nonsense, just pure creative connection.",
    author: "Aisha Patel",
    handle: "@aishathinks",
    role: "Essayist"
  }
];



export default function LandingPage() {
  const router = useRouter();
  const { data } = useGetCurrentUserQuery({});
  const user = data?.currUser;
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const handleAuthAction = async () => {
    if (user) {
      try {
        await signOut();
        router.refresh(); 
      } catch (error) {
        console.error("Logout failed", error);
      }
    } else {
      router.push("/api/auth/signin");
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Inkwell",
            url: "https://inkwell.app",
            description: "Inkwell is the creative space for writers, thinkers, and visual storytellers. Share your thoughts, discover new perspectives, and build your audience.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://inkwell.app/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Inkwell Home">
            <InkwellLogo className="w-7 h-7 text-indigo-400" />
            <span className="text-lg font-bold tracking-tight">Inkwell</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#community" className="hover:text-white transition-colors">Community</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAuthAction}
              className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              {user ? "Log out" : "Log in"}
            </button>
            <button
              onClick={()=> router.push("/signup")}  
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-full transition-all hover:scale-105 active:scale-95">
              Get Started
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* ─── Hero Section ─── */}
        <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-24 px-6 overflow-hidden" aria-labelledby="hero-heading">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/5" />

          {/* Floating orbs */}
          {!reducedMotion && (
            <>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-24 right-[15%] w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-16 left-[8%] w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"
              />
            </>
          )}

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* Left: Copy */}
              <motion.div style={!reducedMotion ? { y: heroY, opacity: heroOpacity } : {}}>
                <motion.div
                  {...fadeIn(0)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500" />
                  </span>
                  Now open to everyone
                </motion.div>

                <motion.h1
                  id="hero-heading"
                  {...fadeIn(0.1)}
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent leading-[1.1]"
                >
                  Where Words
                  <br />
                  Take Flight
                </motion.h1>

                <motion.p
                  {...fadeIn(0.2)}
                  className="text-base sm:text-lg text-slate-400 max-w-lg mb-8 leading-relaxed"
                >
                  Inkwell is the creative space for writers, thinkers, and visual storytellers.
                  Share your thoughts, discover new perspectives, and build your audience.
                </motion.p>

                <motion.div
                  {...fadeIn(0.3)}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
                >
                  <button className="group px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-sm">
                    Start Writing
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </button>
                  <button className="px-6 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-semibold rounded-full border border-slate-700 transition-all hover:border-slate-600 text-sm">
                    Explore Feed
                  </button>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  {...fadeIn(0.4)}
                  className="mt-8 flex items-center gap-5 text-xs text-slate-500"
                >
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" aria-hidden="true" /> Free forever
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" aria-hidden="true" /> No tracking
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> No credit card
                  </span>
                </motion.div>
              </motion.div>

              {/* Right: Mock Post */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 p-5 shadow-2xl shadow-indigo-500/10">
                  <article>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        S
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-white text-sm">Sarah Chen</span>
                          <span className="text-slate-500 text-xs">@sarahchen</span>
                          <span className="text-slate-600 text-xs">· 2h</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed mb-3">
                          Just published my first short story on Inkwell! The writing experience here is absolutely magical. The community feedback has been incredible 🖋️✨
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden">
                            <Image
                              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop"
                              alt="Writing desk with notebook and pen"
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                          <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden">
                            <Image
                              src="https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=400&fit=crop"
                              alt="Coffee cup next to an open notebook"
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-5 text-slate-500">
                          <button className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors group text-xs">
                            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                            <span>24</span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-pink-400 transition-colors group text-xs">
                            <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                            <span>142</span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-green-400 transition-colors group text-xs">
                            <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                            <span>12</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>

                {/* Decorative blur behind mock */}
                <div className="absolute -inset-4 bg-indigo-500/5 rounded-3xl blur-2xl -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Stats Bar ─── */}
        <section className="py-10 border-y border-slate-800/50 bg-slate-900/20" aria-label="Platform statistics">
          <div className="max-w-7xl mx-auto px-6">
            <motion.dl
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn()}
                  className="text-center"
                >
                  <dt className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</dt>
                  <dd className="text-slate-400 text-xs font-medium uppercase tracking-wider">{stat.label}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>
        </section>

        {/* ─── Features (Bento Grid) ─── */}
        <section id="features" className="py-24 px-6" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto">
            <motion.div
              {...fadeIn()}
              className="text-center mb-14"
            >
              <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold mb-3">
                Everything you need to create
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
                Powerful tools designed for modern storytellers. From quick thoughts to long-form essays.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {FEATURES.map((f, i) => (
                <motion.article
                  key={i}
                  variants={fadeIn()}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group p-6 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-indigo-500/25 hover:bg-slate-800/40 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-semibold mb-1.5 text-white">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section id="community" className="py-24 px-6 bg-slate-900/20" aria-labelledby="community-heading">
          <div className="max-w-7xl mx-auto">
            <motion.div
              {...fadeIn()}
              className="text-center mb-14"
            >
              <h2 id="community-heading" className="text-3xl sm:text-4xl font-bold mb-3">
                Loved by creators worldwide
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4">
              {TESTIMONIALS.map((t, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl bg-slate-950 border border-slate-800/50 hover:border-indigo-500/20 transition-all flex flex-col"
                >
                  <Feather className="w-6 h-6 text-indigo-500/40 mb-4" aria-hidden="true" />
                  <blockquote className="text-slate-300 text-sm leading-relaxed mb-5 flex-1">
                    “{t.quote}”
                  </blockquote>
                  <footer className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-white font-semibold text-sm">
                      {t.author[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{t.author}</div>
                      <div className="text-xs text-slate-500">{t.handle}</div>
                    </div>
                  </footer>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-24 px-6 relative overflow-hidden" aria-labelledby="cta-heading">
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent" />
          <motion.div
            {...fadeIn()}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <h2 id="cta-heading" className="text-3xl sm:text-5xl font-bold mb-5">
              Ready to start your story?
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-lg mx-auto">
              Join millions of writers, thinkers, and creators. No credit card required.
            </p>
            <button className="group px-7 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-sm mx-auto">
              Create Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          </motion.div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-800/50 py-10 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <a href="/" className="flex items-center gap-2" aria-label="Inkwell Home">
            <InkwellLogo className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-base">Inkwell</span>
          </a>
          <nav className="flex items-center gap-6 text-sm text-slate-500" aria-label="Footer navigation">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Guidelines</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
          </nav>
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} Inkwell. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
