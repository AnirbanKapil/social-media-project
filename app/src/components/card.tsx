
import { type JSX } from "react";

export function Card ({title,children} : {title : string , children : React.ReactNode}) : JSX.Element {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0f] px-4 py-10 text-[#f0f0f5]">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[150px]" />
        <div className="absolute h-[380px] w-[380px] rounded-full bg-purple-500/15 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#12121a]/90 p-6 shadow-[0_0_60px_-15px_rgba(99,102,241,0.45)] backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <svg
            viewBox="0 0 100 100"
            className="h-12 w-12 text-indigo-400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M50 10 C30 10, 15 25, 15 45 C15 65, 30 80, 50 80 C70 80, 85 65, 85 45 C85 25, 70 10, 50 10Z"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
            <path d="M50 80 L50 95" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M35 95 L65 95" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M50 35 L50 55 M40 45 L60 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="mt-2 text-sm font-medium tracking-tight text-[#888899]">Inkwell</span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#f0f0f5]">{title}</h1>
          <p className="mt-1 text-sm text-[#888899]">A quiet space for loud thoughts.</p>
        </div>
        {children}
      </div>
    </div>
  )
}
