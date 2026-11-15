"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SPLASH_KEY = "inkwell:splash-seen";
const MIN_DISPLAY_MS = 900;
const MAX_DISPLAY_MS = 2200;
const FADE_OUT_MS = 350;

const SPLASH_MESSAGES = [
  {
    quote: "A quiet space for loud thoughts.",
    attribution: "The Inkwell promise",
  },
  {
    quote: "There is no greater agony than bearing an untold story inside you.",
    attribution: "Maya Angelou",
  },
  {
    quote: "Write the thing you wish existed.",
    attribution: "A note from Inkwell",
  },
  {
    quote: "Threads that flow, visuals that speak, people who get it.",
    attribution: "Built for storytellers",
  },
  {
    quote: "The scariest moment is always just before you start.",
    attribution: "Stephen King",
  },
  {
    quote: "Every draft is a conversation with your future self.",
    attribution: "Inkwell community",
  },
  {
    quote: "You can always edit a bad page. You can't edit a blank page.",
    attribution: "Jodi Picoult",
  },
  {
    quote: "Post the photo. Finish the thread. Start the conversation.",
    attribution: "A nudge from Inkwell",
  },
  {
    quote: "Stories are the shortest distance between two people.",
    attribution: "Inkwell",
  },
  {
    quote: "Good writing is simply good thinking made visible.",
    attribution: "Inkwell",
  },
];

export function LandingSplash() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [message, setMessage] = useState(SPLASH_MESSAGES[0]);
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;

    setLeaving(true);
    try {
      window.sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {
      // sessionStorage can be unavailable in private modes; ignore.
    }
    window.setTimeout(() => {
      document.documentElement.dataset.splashSeen = "1";
      setVisible(false);
    }, FADE_OUT_MS);
  }, []);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(SPLASH_KEY) === "1";
    } catch {
      alreadySeen = false;
    }

    if (alreadySeen) {
      document.documentElement.dataset.splashSeen = "1";
      const hideTimer = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(hideTimer);
    }

    let cancelled = false;
    let minElapsed = false;
    let fontsReady = false;
    let finished = false;

    const messageTimer = window.setTimeout(() => {
      setMessage(
        SPLASH_MESSAGES[Math.floor(Math.random() * SPLASH_MESSAGES.length)],
      );
    }, 50);

    const finish = () => {
      if (finished || cancelled) return;
      finished = true;
      dismiss();
    };

    const tryFinish = () => {
      if (minElapsed && fontsReady) finish();
    };

    const minTimer = window.setTimeout(() => {
      minElapsed = true;
      tryFinish();
    }, MIN_DISPLAY_MS);

    const maxTimer = window.setTimeout(finish, MAX_DISPLAY_MS);

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (cancelled) return;
        fontsReady = true;
        tryFinish();
      });
    } else {
      fontsReady = true;
      tryFinish();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelled = true;
      window.clearTimeout(messageTimer);
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dismiss]);

  if (!visible) return null;

  return (
    <div
      id="landing-splash"
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#07070e] px-6 text-[#f0f0f5] transition-opacity duration-300 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_OUT_MS}ms` }}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/15 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] h-[360px] w-[360px] rounded-full bg-purple-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute left-[-10%] top-[-15%] h-[320px] w-[320px] rounded-full bg-cyan-400/5 blur-[110px]" />

      <div className="relative w-full max-w-lg text-center">
        <div className="mx-auto mb-8 flex items-center justify-center gap-2.5">
          <svg
            viewBox="0 0 100 100"
            className="h-10 w-10 text-indigo-400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M50 10 C30 10, 15 25, 15 45 C15 65, 30 80, 50 80 C70 80, 85 65, 85 45 C85 25, 70 10, 50 10Z"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path d="M50 80 L50 95" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M35 95 L65 95" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path
              d="M50 35 L50 55 M40 45 L60 45"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-xl font-semibold tracking-tight">Inkwell</span>
        </div>

        <blockquote className="min-h-32">
          <p className="text-balance text-2xl font-medium leading-snug tracking-tight text-[#f0f0f5] sm:text-3xl">
            &ldquo;{message.quote}&rdquo;
          </p>
          <footer className="mt-4 text-sm text-[#888899]">
            {message.attribution}
          </footer>
        </blockquote>

        <div className="mx-auto mt-10 h-1 w-40 overflow-hidden rounded-full bg-white/10">
          <div className="splash-bar h-full w-full rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" />
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-[#d0d0dc] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
          >
            Skip
          </button>
          <p className="text-xs uppercase tracking-[0.25em] text-[#555566]">
            Threads · Visuals · Connections
          </p>
        </div>
      </div>
    </div>
  );
}
