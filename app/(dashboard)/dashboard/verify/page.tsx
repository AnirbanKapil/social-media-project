"use client";

import { BadgeCheck, Check, Crown, ShieldCheck } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$10",
    period: "for 1 month",
    description: "Try verification without a long-term commitment.",
    features: ["Verified blue badge", "Priority profile visibility", "Cancel anytime"],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "$100",
    period: "for 1 year",
    description: "Save compared with renewing every month.",
    features: ["Verified blue badge", "Priority profile visibility", "Best value for regular users"],
    popular: true,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$500",
    period: "one-time",
    description: "A single payment for permanent verification.",
    features: ["Verified blue badge", "Priority profile visibility", "Lifetime account access"],
  },
];

export default function VerifyPage() {
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  return (
    <main className="min-h-full px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-xl">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/60">
            <BadgeCheck size={30} strokeWidth={2.1} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-950">Get verified</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Choose a plan and stand out with a verified badge on your profile.
          </p>
        </header>

        <div className="grid gap-4">
          {plans.map((plan) => {
            const selected = selectedPlan === plan.id;

            return (
              <article
                key={plan.id}
                className={`relative rounded-2xl border bg-white p-5 transition-all ${
                  selected
                    ? "border-blue-500 shadow-lg shadow-blue-100"
                    : "border-gray-200 shadow-sm hover:border-gray-300"
                }`}
              >
                {plan.popular && (
                  <span className="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}

                <div className="pr-24">
                  <h2 className="font-semibold text-gray-950">{plan.name}</h2>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-950">{plan.price}</span>
                    <span className="pb-1 text-sm text-gray-500">{plan.period}</span>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-500">{plan.description}</p>

                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Check size={13} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    selected
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
                  }`}
                  aria-pressed={selected}
                >
                  {selected ? `Selected · ${plan.name}` : `Choose ${plan.name}`}
                </button>
              </article>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!selectedPlan}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {selectedPlan === "lifetime" ? <Crown size={18} /> : <ShieldCheck size={18} />}
          Continue with verification
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-gray-400">
          Frontend preview only — payment and verification processing will be added later.
        </p>
      </div>
    </main>
  );
}
