import Hero from "@/components/Hero";
import { Upload, Brain, Search, ShieldCheck, FileCheck } from "lucide-react";
import Link from "next/link";

const steps = [
  { icon: Upload, title: "Upload", desc: "Share your profile and upload supporting documents." },
  { icon: Brain, title: "Understand", desc: "AI extracts key information from your documents." },
  { icon: Search, title: "Match", desc: "Find relevant government schemes for your profile." },
  { icon: ShieldCheck, title: "Verify", desc: "Rule-based eligibility check with official evidence." },
  { icon: FileCheck, title: "Apply", desc: "Get clear guidance on how to apply with sources." },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="how-it-works" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">How FinSarthi Works</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              A simple, trustworthy workflow from document upload to verified eligibility results.
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                  <step.icon className="h-6 w-6" />
                </div>
                <p className="mt-1 text-xs font-bold text-indigo-400">STEP {i + 1}</p>
                <h3 className="mt-2 font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-indigo-900">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">Ready to discover your benefits?</h2>
          <p className="mt-4 text-indigo-200">
            Try the demo in under 2 minutes — no API key required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/onboarding?demo=true" className="btn-primary !bg-white !text-indigo-900 hover:!bg-indigo-50">
              Try Demo
            </Link>
            <Link href="/onboarding" className="btn-secondary !border-indigo-700 !bg-transparent !text-white hover:!bg-indigo-800">
              Check My Eligibility
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
