"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { MessageCircle, X } from "lucide-react";

export type ToastInput = {
  title: string;
  description?: string;
  href?: string;
};

type ToastItem = ToastInput & { id: number };

type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 5000;
const MAX_VISIBLE_TOASTS = 3;

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: ToastInput) => {
      const id = nextId.current;
      nextId.current += 1;

      setToasts((current) => [
        ...current.slice(-(MAX_VISIBLE_TOASTS - 1)),
        { ...toast, id },
      ]);

      setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
    },
    [dismissToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-20 z-[100] flex flex-col items-end gap-2 sm:bottom-6 sm:right-6 sm:left-auto">
        {toasts.map((toast) => {
          const content = (
            <>
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <MessageCircle size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-white">
                  {toast.title}
                </span>
                {toast.description && (
                  <span className="mt-0.5 block line-clamp-2 text-xs leading-5 text-slate-400">
                    {toast.description}
                  </span>
                )}
              </span>
            </>
          );

          return (
            <div
              key={toast.id}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-white/10 bg-[#0d111b] p-3 shadow-2xl shadow-black/40"
            >
              {toast.href ? (
                <Link
                  href={toast.href}
                  onClick={() => dismissToast(toast.id)}
                  className="flex min-w-0 flex-1 items-start gap-3"
                >
                  {content}
                </Link>
              ) : (
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  {content}
                </div>
              )}
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded-lg p-1 text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
