"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";
import { UserProfile, getDemoData } from "@/lib/api";
import { saveProfile } from "@/lib/store";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";

  const [initial, setInitial] = useState<Partial<UserProfile> | undefined>();

  useEffect(() => {
    if (isDemo) {
      getDemoData()
        .then((data) => setInitial(data.demo_profile))
        .catch(() => setInitial(undefined));
    }
  }, [isDemo]);

  const handleSubmit = (profile: UserProfile) => {
    saveProfile(profile);
    router.push(isDemo ? "/upload?demo=true" : "/upload");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Top Progress / Brand Area */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20">
              F
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                FinSarthi
              </p>
              <p className="text-xs text-slate-500">
                Smart Scheme Assistant
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="h-2 w-16 rounded-full bg-blue-600" />
            <div className="h-2 w-16 rounded-full bg-slate-200" />
            <div className="h-2 w-16 rounded-full bg-slate-200" />
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 ring-8 ring-blue-50/50">
            <svg
              className="h-7 w-7 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Tell us about yourself
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Share a few basic details and FinSarthi will help identify
            government schemes and benefits you may be eligible for.
          </p>

          {isDemo && (
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Demo Mode — Rahul Patil profile loaded
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">

          {/* Decorative top line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mb-7">
              <h2 className="text-lg font-semibold text-slate-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                This information helps us personalize your scheme discovery.
              </p>
            </div>

            <ProfileForm
              initial={initial}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        {/* Privacy / Trust */}
        <div className="mt-6 flex flex-col items-center justify-center gap-2 text-center sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <svg
              className="h-4 w-4 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 12 2 2 4-4"
              />
            </svg>

            <span>
              Your information is used only to find relevant schemes.
            </span>
          </div>
        </div>

        <p className="mt-3 pb-4 text-center text-xs text-slate-400">
          Step 1 of 3
        </p>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="text-sm text-slate-500">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}