import { UserStatsCard } from "./UserStatsCard";
import { WhoToFollow } from "./WhoToFollow";
import { PopularThreadsCard } from "./PopularThreadsCard";
import { Sparkles } from "lucide-react";

export  function WhatsHappening () {
    return (
        <aside
            aria-labelledby="whats-happening-heading"
            className="flex h-[66vh] ml-5 min-h-96 max-h-[760px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50 shadow-xl shadow-slate-900/5"
        >
            <header className="shrink-0 border-b border-slate-200/80 px-5 pb-4 pt-5">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600 ring-1 ring-inset ring-indigo-100">
                    <Sparkles size={12} aria-hidden="true" />
                    Your daily brief
                </div>
                <h2 id="whats-happening-heading" className="text-xl font-bold tracking-tight text-slate-900">
                    What&apos;s happening
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    People and conversations worth a look.
                </p>
            </header>

            <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
                <section className="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-900/[0.03]">
                    <UserStatsCard />
                </section>
                <section className="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-900/[0.03]">
                    <PopularThreadsCard />
                </section>
                <section className="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-900/[0.03]">
                    <WhoToFollow />
                </section>
            </div>
        </aside>
    );
}
