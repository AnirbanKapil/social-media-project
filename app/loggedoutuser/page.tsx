"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function LoggedOutUserPage() {
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Artificial micro-delay for a smooth premium visual transition
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#07070e] flex flex-col items-center justify-center px-4 overflow-hidden text-white font-sans">
      
      {/* 🔮 Background Graphic 1: Deep Indigo Mesh Orb */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* 🔮 Background Graphic 2: Cyber Emerald/Teal Blur */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* 🎛️ Glassmorphism Wrapper Container */}
      <div className="relative max-w-md w-full backdrop-blur-xl bg-white/[0.02] border border-white/[0.07] p-8 sm:p-10 rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.7)] text-center transition-all duration-500 scale-100">
        
        {/* Decorative subtle grid line texture inside card */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] rounded-3xl pointer-events-none" />

        {isProcessing ? (
          <div className="py-12 space-y-6">
            {/* Spinning Loader Graphic */}
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
              <div className="absolute inset-0 rounded-full border-2 border-t-indigo-400 border-r-emerald-400 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-slate-200 tracking-wide">Securing Session</h3>
              <p className="text-xs text-slate-500">Clearing data and logs...</p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 space-y-8 animate-[fadeIn_0.4s_ease-out]">
            
            {/* 🛡️ Header Abstract Visual Graphic */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              {/* Pulsing Outer Neon Glow Rings */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 rounded-2xl rotate-12 animate-pulse" />
              <div className="absolute inset-2 bg-[#0c0d19] border border-white/[0.05] rounded-2xl" />
              
              {/* Inner SVG Graphic */}
              <svg 
                className="w-8 h-8 text-indigo-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 0015.75 21V15M18 12H9m9 0l-3-3m3 3l-3 3" />
              </svg>
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                Safe Exit Complete
              </h2>
              <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                Your session has been closed securely. All client cache tokens have been cleared.
              </p>
            </div>

            {/* Separator Divider Line */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                href="/api/auth/signin"
                className="group relative w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-black bg-white hover:bg-slate-100 shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all duration-200 active:scale-[0.98]"
              >
                Sign In Again
                <span className="inline-block transform translate-x-0 group-hover:translate-x-1 transition-transform ml-1">→</span>
              </Link>

              {/* Hard reload on landing page ensures everything re-mounts clean */}
              <a
                href="/"
                className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-slate-300 bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:text-white transition-all duration-200"
              >
                Go to Homepage
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding Accent */}
      <div className="mt-8 text-center pointer-events-none z-10">
        <p className="text-xs text-slate-600 tracking-widest uppercase">System Core Secure</p>
      </div>
    </div>
  );
}
