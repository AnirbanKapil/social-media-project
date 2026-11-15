export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading your feed"
      className="min-h-screen bg-[#080b12] px-4 py-6 text-slate-100 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <div className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded-full bg-white/10" />
              <div className="h-2.5 w-20 rounded-full bg-white/5" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded-full bg-white/5" />
            <div className="h-3 w-4/5 rounded-full bg-white/5" />
          </div>
        </div>

        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div className="space-y-2">
                <div className="h-3 w-28 rounded-full bg-white/10" />
                <div className="h-2.5 w-16 rounded-full bg-white/5" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded-full bg-white/5" />
              <div className="h-3 w-11/12 rounded-full bg-white/5" />
              <div className="h-3 w-3/5 rounded-full bg-white/5" />
            </div>
            <div className="mt-4 h-40 w-full rounded-xl bg-white/5" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
