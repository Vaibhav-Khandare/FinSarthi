"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AnalysisProgress from "@/components/AnalysisProgress";
import { analyzeProfile, ApiError } from "@/lib/api";
import { getProfile, getDocuments, saveAnalysis } from "@/lib/store";
import { AlertCircle } from "lucide-react";

export default function AnalyzingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [aiActivity, setAiActivity] = useState<string[]>([]);
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const profile = getProfile();
    const docs = getDocuments();

    if (!profile) {
      router.push("/onboarding");
      return;
    }

    const docIds = docs.map((d) => d.id).filter((id) => !id.startsWith("demo-doc-"));

    const stepInterval = setInterval(() => {
      setCurrentStep((s) => Math.min(s + 1, 5));
      setProgress((p) => Math.min(p + 15, 85));
    }, 400);

    analyzeProfile(profile, docIds)
      .then((result) => {
        clearInterval(stepInterval);
        setCurrentStep(6);
        setProgress(100);
        setAiActivity(result.ai_activity);
        saveAnalysis(result);
        setTimeout(() => router.push("/dashboard"), 800);
      })
      .catch((e) => {
        clearInterval(stepInterval);
        setError(e instanceof ApiError ? e.message : "Analysis failed. Please try again.");
      });

    return () => clearInterval(stepInterval);
  }, [router]);

  if (error) {
    return (
      <div className="py-20 px-4 text-center">
        <div className="mx-auto max-w-md card border-red-100 bg-red-50">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
          <h2 className="mt-4 text-lg font-bold text-red-900">Analysis Failed</h2>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button onClick={() => router.push("/upload")} className="mt-4 btn-primary !bg-red-600 hover:!bg-red-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <AnalysisProgress currentStep={currentStep} aiActivity={aiActivity} progress={progress} />
    </div>
  );
}
