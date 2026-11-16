import Link from "next/link";

type LandingHeaderProps = {
  isAuthenticated: boolean;
};

export function LandingHeader({ isAuthenticated }: LandingHeaderProps) {
  return (
    <header className="relative z-20 mx-4 my-3 flex items-center justify-between bg-[#0a0a0f]/80 px-4 py-2 text-[#f0f0f5] md:mx-12 lg:mx-48">
      <Link href="/" className="flex items-center gap-2.5">
        <svg
          viewBox="0 0 100 100"
          className="h-9 w-9 text-indigo-400"
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
        <span className="text-xl font-bold tracking-tight">Inkwell</span>
      </Link>

      <nav className="flex items-center gap-3">
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#f0f0f5] px-4 py-2 text-sm font-medium text-[#0a0a0f] transition-all hover:scale-105 hover:bg-white active:scale-95"
          >
            Go to dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/signin"
              className="rounded-lg border border-[#333340] px-4 py-2 text-sm font-medium text-[#f0f0f5] transition-colors hover:border-[#555566]"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-[#f0f0f5] px-4 py-2 text-sm font-medium text-[#0a0a0f] transition-all hover:scale-105 hover:bg-white active:scale-95"
            >
              Get started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
