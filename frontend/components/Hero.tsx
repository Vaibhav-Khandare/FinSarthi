"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const metrics = [
  { label: "Schemes matched", value: "6", hint: "From official catalogues", color: "text-indigo-700" },
  { label: "Likely eligible", value: "3", hint: "Conditions satisfied", color: "text-emerald-600" },
  { label: "Needs review", value: "2", hint: "Documents pending", color: "text-amber-600" },
];

const schemes = [
  { name: "Post-Matric Scholarship", match: 94, status: "Likely eligible", tone: "emerald" },
  { name: "National Scholarship Portal", match: 88, status: "Likely eligible", tone: "emerald" },
  { name: "PM-KISAN Direct Benefit", match: 61, status: "Needs review", tone: "amber" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="pointer-events-none absolute -top-24 right-0 h-[520px] w-[520px] rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[-120px] h-[360px] w-[360px] rounded-full bg-violet-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-indigo-700 shadow-sm shadow-indigo-900/5 sm:text-sm">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span className="truncate">AI understanding · Rule-based eligibility · Official evidence</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
              Find government benefits
              <span className="mt-1 block text-indigo-700">you actually qualify for.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              FinSarthi reads your documents, matches relevant schemes, and explains eligibility
              with verified conditions — so you apply with clarity, not guesswork.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/onboarding" className="btn-primary">
                Check my eligibility
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#how-it-works" className="btn-secondary">
                See how it works
              </a>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-7 sm:gap-y-3">
              {[
                "Evidence-backed results",
                "Transparent eligibility rules",
                "Official scheme sources",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-indigo-200/40 via-transparent to-violet-200/30 blur-xl" />

            <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-indigo-900/10">
              <div className="flex items-center justify-between border-b border-indigo-800/20 bg-indigo-800 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                  </div>
                  <p className="text-sm font-semibold text-white">Eligibility dashboard</p>
                </div>
                <span className="hidden rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-200 sm:inline-flex">
                  Analysis complete
                </span>
              </div>

              <div className="space-y-4 p-4 sm:p-5">
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                      RS
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Rahul Sharma</p>
                      <p className="text-xs text-slate-500">Pune, Maharashtra · Student</p>
                    </div>
                  </div>
                  <div className="hidden items-center gap-1.5 text-xs font-medium text-slate-500 sm:flex">
                    <FileText className="h-3.5 w-3.5 text-indigo-500" />
                    4 documents
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {metrics.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm shadow-slate-900/5 sm:p-3"
                    >
                      <p className={`text-xl font-bold sm:text-2xl ${stat.color}`}>{stat.value}</p>
                      <p className="mt-0.5 text-[10px] font-medium leading-tight text-slate-600 sm:text-xs">
                        {stat.label}
                      </p>
                      <p className="mt-1 hidden text-[10px] text-slate-400 sm:block">{stat.hint}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {schemes.map((s) => (
                    <div
                      key={s.name}
                      className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm shadow-slate-900/5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">{s.name}</p>
                          <p className="mt-1 text-[11px] text-slate-500">{s.match}% profile match</p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold sm:text-xs ${
                            s.tone === "emerald"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            s.tone === "emerald" ? "bg-indigo-600" : "bg-amber-500"
                          }`}
                          style={{ width: `${s.match}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-2.5 text-xs text-indigo-800">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-600" />
                  Each result cites scheme conditions and source documents.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}