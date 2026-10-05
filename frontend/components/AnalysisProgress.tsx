"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Reading your documents",
  "Extracting profile information",
  "Finding relevant schemes",
  "Checking eligibility conditions",
  "Verifying evidence",
  "Preparing recommendations",
];

interface Props {
  currentStep: number;
  aiActivity: string[];
  progress: number;
}

export default function AnalysisProgress({ currentStep, aiActivity, progress }: Props) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">FinSarthi is analyzing your case</h1>
        <p className="mt-2 text-slate-500">This usually takes a few seconds</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card">
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-slate-700">Progress</span>
              <span className="text-indigo-600 font-semibold">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {STEPS.map((step, i) => {
              const done = i < currentStep;
              const active = i === currentStep;
              return (
                <div key={step} className="flex items-center gap-3">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  ) : active ? (
                    <Loader2 className="h-5 w-5 text-indigo-600 animate-spin shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                  )}
                  <span className={cn(
                    "text-sm",
                    done ? "text-emerald-700 font-medium" : active ? "text-indigo-700 font-semibold" : "text-slate-400"
                  )}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card bg-indigo-900 text-white !border-indigo-800">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-sm font-bold tracking-wider uppercase text-indigo-200">FinSarthi AI</p>
          </div>
          <div className="space-y-3">
            {aiActivity.length === 0 ? (
              <p className="text-indigo-300 text-sm animate-pulse">Initializing analysis...</p>
            ) : (
              aiActivity.map((item, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-sm text-indigo-100"
                >
                  {item}
                </motion.p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
