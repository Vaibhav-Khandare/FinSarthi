"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DocumentUploader from "@/components/DocumentUploader";
import { UploadedDocument, getDemoData } from "@/lib/api";
import { getProfile, saveDocuments, getDocuments } from "@/lib/store";
import { ArrowRight } from "lucide-react";

function UploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [demoLoaded, setDemoLoaded] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    if (!profile) {
      router.push("/onboarding");
      return;
    }
    setDocuments(getDocuments());
  }, [router]);

  useEffect(() => {
    if (isDemo && !demoLoaded) {
      getDemoData().then(async (data) => {
        const demoDocs: UploadedDocument[] = data.demo_documents.map((d, i) => ({
          id: `demo-doc-${i}`,
          filename: d.filename,
          size: d.content.length,
          status: "ready",
          extraction_success: true,
        }));
        setDocuments(demoDocs);
        saveDocuments(demoDocs);
        setDemoLoaded(true);
      }).catch(() => setDemoLoaded(true));
    }
  }, [isDemo, demoLoaded]);

  const handleContinue = () => {
    saveDocuments(documents);
    router.push(isDemo ? "/analyzing?demo=true" : "/analyzing");
  };

  const handleChange = (docs: UploadedDocument[]) => {
    setDocuments(docs);
    saveDocuments(docs);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-indigo-600">STEP 2 OF 3</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Upload Documents</h1>
          <p className="mt-2 text-slate-500">Upload certificates and identity documents for accurate analysis</p>
          {isDemo && (
            <span className="mt-3 inline-block rounded-full bg-amber-50 border border-amber-200 px-4 py-1 text-xs font-semibold text-amber-700">
              Demo documents loaded
            </span>
          )}
        </div>

        <DocumentUploader documents={documents} onChange={handleChange} />

        <div className="mt-8 flex justify-end">
          <button onClick={handleContinue} className="btn-primary">
            Analyze My Eligibility <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading...</div>}>
      <UploadContent />
    </Suspense>
  );
}
