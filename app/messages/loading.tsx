export default function MessagesLoading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading your conversations"
      className="flex h-dvh flex-col overflow-hidden bg-[#080b12] px-4 py-5 text-slate-100 sm:px-7 sm:py-7 lg:px-10"
    >
      <div className="mx-auto mb-5 flex w-full max-w-7xl animate-pulse items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-white/10" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded-full bg-white/10" />
          <div className="h-2.5 w-48 rounded-full bg-white/5" />
        </div>
      </div>
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0d111b]">
        <div className="w-full shrink-0 space-y-3 border-r border-white/10 p-4 lg:w-[340px]">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex animate-pulse items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-28 rounded-full bg-white/10" />
                <div className="h-2.5 w-40 rounded-full bg-white/5" />
              </div>
            </div>
          ))}
        </div>
        <div className="hidden flex-1 items-center justify-center lg:flex">
          <p className="animate-pulse text-sm text-slate-500">
            Loading conversations...
          </p>
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </main>
  );
}
