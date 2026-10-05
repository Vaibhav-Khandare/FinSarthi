"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
              <Sparkles className="h-4 w-4" />
              AI + Rules + Evidence
            </div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find Government Benefits{" "}
              <span className="text-indigo-700">You Actually Qualify For.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
              FinSarthi uses AI to understand your documents, discover relevant government schemes,
              and explain your eligibility with verified evidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/onboarding" className="btn-primary">
                Check My Eligibility
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#how-it-works" className="btn-secondary">
                Explore How It Works
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-6">
              {["Evidence-backed", "Rule-based eligibility", "Official sources"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="card !p-0 overflow-hidden shadow-xl shadow-indigo-900/5">
              <div className="bg-indigo-800 px-6 py-4">
                <p className="text-sm font-medium text-indigo-200">FinSarthi AI Analysis</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold">AI</div>
                  <div>
                    <p className="font-semibold text-slate-900">Analysis Complete</p>
                    <p className="text-sm text-slate-500">Documents processed successfully</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Schemes Found", value: "6", color: "text-indigo-700" },
                    { label: "Likely Eligible", value: "3", color: "text-emerald-600" },
                    { label: "Needs Review", value: "2", color: "text-amber-500" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-slate-50 p-3 text-center">
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Maharashtra Student Support", status: "LIKELY ELIGIBLE", color: "bg-emerald-100 text-emerald-700" },
                    { name: "National Scholarship Portal", status: "LIKELY ELIGIBLE", color: "bg-emerald-100 text-emerald-700" },
                    { name: "PM-KISAN Direct Benefit", status: "NEEDS REVIEW", color: "bg-amber-100 text-amber-700" },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                      <span className="text-sm font-medium text-slate-700 truncate mr-2">{s.name}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${s.color}`}>{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
