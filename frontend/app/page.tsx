import Hero from "@/components/Hero";
import { Upload, Brain, Search, ShieldCheck, FileCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  { icon: Upload, title: "Upload", desc: "Share your profile and supporting documents in one place." },
  { icon: Brain, title: "Understand", desc: "AI extracts the facts that matter for scheme eligibility." },
  { icon: Search, title: "Match", desc: "Relevant government schemes are ranked for your profile." },
  { icon: ShieldCheck, title: "Verify", desc: "Rule-based checks explain what passed, failed, or needs review." },
  { icon: FileCheck, title: "Apply", desc: "Get clear next steps with official sources to apply confidently." },
];

const highlights = [
  { value: "Evidence-first", label: "Every eligibility call is tied to documented conditions." },
  { value: "Rule-based", label: "AI assists discovery. Rules decide eligibility." },
  { value: "Citizen-ready", label: "Plain-language results you can act on immediately." },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="border-y border-slate-200/80 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
          {highlights.map((item) => (
            <div key={item.value} className="text-center sm:text-left">
              <p className="text-sm font-bold tracking-wide text-indigo-700">{item.value}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 bg-slate-50/80 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-700">Workflow</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How FinSarthi works
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              A connected path from documents to verified eligibility — designed to be transparent at every step.
            </p>
          </div>

          <div className="relative mt-12 lg:mt-16">
            <div className="pointer-events-none absolute left-[10%] right-[10%] top-[42px] hidden h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent lg:block" />

            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/5 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-900/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 transition-colors group-hover:bg-indigo-700 group-hover:text-white group-hover:ring-indigo-700">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold tabular-nums text-indigo-400">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-indigo-900 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to see what you qualify for?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-indigo-200 sm:text-lg">
            Start with your profile. FinSarthi will match schemes and show eligibility with evidence you can trust.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/onboarding" className="btn-primary !bg-white !text-indigo-900 hover:!bg-indigo-50">
              Check my eligibility
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/schemes"
              className="btn-secondary !border-indigo-500/60 !bg-transparent !text-white hover:!border-white hover:!bg-indigo-800"
            >
              Browse schemes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}