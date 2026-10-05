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
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Tell us about yourself</h1>
        <p className="mt-2 text-slate-500">
          {isDemo ? "Demo profile loaded — review and continue" : "We'll use this to find schemes you may qualify for"}
        </p>
        {isDemo && (
          <span className="mt-3 inline-block rounded-full bg-amber-50 border border-amber-200 px-4 py-1 text-xs font-semibold text-amber-700">
            Demo Mode — Rahul Patil profile
          </span>
        )}
      </div>
      <ProfileForm initial={initial} onSubmit={handleSubmit} />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
