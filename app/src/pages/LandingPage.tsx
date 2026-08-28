'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';
import { useRef } from 'react';
import Image from 'next/image';
import { NavBar } from '../components/navbar';

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }
});

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

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <div>
     <NavBar />  
     <div ref={containerRef} className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] overflow-x-hidden selection:bg-indigo-500/30 selection:text-white flex items-center justify-center px-6 py-16">
      <div className="max-w-5xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Copy */}
          <motion.div style={!reducedMotion ? { y: heroY, opacity: heroOpacity } : {}}>
            {/* Brand */}
            <motion.div
              {...fadeIn(0)}
              className="flex items-center gap-2.5 mb-10"
            >
              <svg viewBox="0 0 100 100" className="w-10 h-10 text-indigo-400" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <span className="text-lg font-medium tracking-tight">Inkwell</span>
            </motion.div>

            <motion.h1
              {...fadeIn(0.1)}
              className="text-4xl sm:text-5xl lg:text-[52px] font-medium tracking-tight mb-5 leading-[1.1]"
            >
              Share your story
              <br />
              with the world
            </motion.h1>

            <motion.p
              {...fadeIn(0.2)}
              className="text-base text-[#888899] max-w-md mb-8 leading-relaxed"
            >
              A quiet space for loud thoughts. Post photos, write threads, and connect with people who get it.
            </motion.p>

            <motion.div
              {...fadeIn(0.3)}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <button className="group px-6 py-3 bg-[#f0f0f5] hover:bg-white text-[#0a0a0f] font-medium rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-sm">
                Get started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
              <button className="px-6 py-3 bg-transparent text-[#f0f0f5] font-medium rounded-lg border border-[#333340] hover:border-[#555566] transition-all text-sm">
                Learn more
              </button>
            </motion.div>

            {/* Features row */}
            <motion.div
              {...fadeIn(0.4)}
              className="mt-12 flex gap-8"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#15151f] border border-[#22222e] flex items-center justify-center mb-3">
                  <MessageCircle className="w-4 h-4 text-[#888899]" aria-hidden="true" />
                </div>
                <h4 className="text-sm font-medium mb-1">Threads</h4>
                <p className="text-xs text-[#666680] leading-relaxed">Write long-form stories<br/>that flow.</p>
              </div>
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#15151f] border border-[#22222e] flex items-center justify-center mb-3">
                  <ImageIcon className="w-4 h-4 text-[#888899]" aria-hidden="true" />
                </div>
                <h4 className="text-sm font-medium mb-1">Visuals</h4>
                <p className="text-xs text-[#666680] leading-relaxed">Share up to 4 photos<br/>per post.</p>
              </div>
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#15151f] border border-[#22222e] flex items-center justify-center mb-3">
                  <Heart className="w-4 h-4 text-[#888899]" aria-hidden="true" />
                </div>
                <h4 className="text-sm font-medium mb-1">Connect</h4>
                <p className="text-xs text-[#666680] leading-relaxed">Engage with people<br/>who get it.</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="w-[260px] bg-[#12121a] rounded-[28px] border-2 border-[#22222e] p-4 shadow-2xl">
              {/* Phone Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1e1e28]">
                <span className="text-xs font-medium text-[#888899]">For you</span>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#555566]">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#555566]">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                  </svg>
                </div>
              </div>

              {/* Post 1 */}
              <div className="bg-[#15151f] rounded-xl p-3 mb-3 border border-[#1e1e28]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#2a2a3a] flex items-center justify-center">
                    <span className="text-[10px] font-medium text-[#666680]">S</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#555566]">@sarahchen · 2h</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#b0b0c0] leading-relaxed mb-2">
                  Just published my first short story! The writing experience here is absolutely magical ✨
                </p>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  <div className="aspect-square bg-[#1e1e2e] rounded-md overflow-hidden">
                    <Image
                      width={120}
                      height={120}
                      src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop"
                      alt="Writing desk with notebook"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="aspect-square bg-[#1e1e2e] rounded-md overflow-hidden">
                    <Image
                      width={120}
                      height={120}
                      src="https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=400&fit=crop"
                      alt="Coffee cup next to notebook"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-[#555566]">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" aria-hidden="true" /> 24
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" aria-hidden="true" /> 142
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3 h-3" aria-hidden="true" /> 12
                  </span>
                </div>
              </div>

              {/* Post 2 */}
              <div className="bg-[#15151f] rounded-xl p-3 border border-[#1e1e28]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#2a2a3a] flex items-center justify-center">
                    <span className="text-[10px] font-medium text-[#666680]">M</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-[#f0f0f5]">Maya Chen</span>
                    <span className="text-[10px] text-[#555566]">@mayac · 4h</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#b0b0c0] leading-relaxed mb-2">
                  Golden hour hits different when you are chasing it.
                </p>
                <div className="w-full h-20 bg-[#1e1e2e] rounded-md flex items-center justify-center mb-2">
                  <ImageIcon className="w-5 h-5 text-[#444455]" aria-hidden="true" />
                </div>
                <div className="flex items-center gap-4 text-[10px] text-[#555566]">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" aria-hidden="true" /> 24
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" aria-hidden="true" /> 156
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3 h-3" aria-hidden="true" /> 8
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative glow behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
     </div>
    </div>
  );
}