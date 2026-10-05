"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SchemeCard from "@/components/SchemeCard";
import { AnalysisResponse } from "@/lib/api";
import { getAnalysis, getProfile } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  useEffect(() => {
    const data = getAnalysis();
    if (!data) {
      router.push("/onboarding");
      return;
    }
    setAnalysis(data);
  }, [router]);

  if (!analysis) return <div className="py-20 text-center text-slate-500">Loading dashboard...</div>;

  const { summary, results } = analysis;
  const profile = getProfile();

  const chartData = [
    { name: "Eligible", value: summary.likely_eligible, color: "#10b981" },
    { name: "Review", value: summary.needs_review, color: "#f59e0b" },
    { name: "Not Eligible", value: summary.not_eligible, color: "#ef4444" },
  ];

  const topResults = [...results].sort((a, b) => {
    const order = { LIKELY_ELIGIBLE: 0, NEEDS_REVIEW: 1, NOT_ELIGIBLE: 2 };
    return (order[a.evaluation.status as keyof typeof order] ?? 3) - (order[b.evaluation.status as keyof typeof order] ?? 3);
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-slate-900">Your Benefit Dashboard</h1>
          {profile && (
            <p className="mt-1 text-slate-500">Welcome, {profile.full_name} — {profile.district}, {profile.state}</p>
          )}
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Schemes Found", value: summary.schemes_found, color: "text-indigo-700" },
            { label: "Likely Eligible", value: summary.likely_eligible, color: "text-emerald-600" },
            { label: "Needs Review", value: summary.needs_review, color: "text-amber-500" },
            { label: "Missing Documents", value: summary.missing_documents, color: "text-red-500" },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Top Recommendations</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {topResults.map((result) => (
                <SchemeCard key={result.scheme_id} result={result} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="font-bold text-slate-900 mb-4">Eligibility Overview</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card bg-slate-50">
              <p className="text-xs text-slate-500 leading-relaxed">{analysis.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
