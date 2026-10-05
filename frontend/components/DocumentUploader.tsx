"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { uploadDocument, UploadedDocument, ApiError } from "@/lib/api";
import { formatFileSize } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  documents: UploadedDocument[];
  onChange: (docs: UploadedDocument[]) => void;
}

export default function DocumentUploader({ documents, onChange }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setError("");
    setUploading(true);
    const newDocs = [...documents];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["pdf", "png", "jpg", "jpeg"].includes(ext || "")) {
        setError(`Unsupported file type: ${file.name}`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`File too large: ${file.name} (max 10MB)`);
        continue;
      }
      try {
        const doc = await uploadDocument(file);
        newDocs.push(doc);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Upload failed");
      }
    }

    onChange(newDocs);
    setUploading(false);
  }, [documents, onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const remove = (id: string) => {
    onChange(documents.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-10 text-center transition-all",
          dragging ? "border-indigo-500 bg-indigo-50/50" : "border-slate-200 bg-slate-50/50 hover:border-indigo-300"
        )}
      >
        <Upload className="mx-auto h-10 w-10 text-indigo-400" />
        <p className="mt-4 text-lg font-semibold text-slate-900">Drop documents here</p>
        <p className="mt-1 text-sm text-slate-500">PDF, PNG, JPG up to 10MB</p>
        <label className="mt-4 inline-block cursor-pointer btn-primary !py-2.5 !text-sm">
          {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : "Browse Files"}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            multiple
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            disabled={uploading}
          />
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {documents.length > 0 && (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{doc.filename}</p>
                <p className="text-sm text-slate-500">{formatFileSize(doc.size)}</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Ready
              </div>
              <button onClick={() => remove(doc.id)} className="p-1 text-slate-400 hover:text-red-500" aria-label="Remove">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl bg-indigo-50/50 border border-indigo-100 p-5">
        <h4 className="font-semibold text-indigo-900">Why do we need documents?</h4>
        <p className="mt-2 text-sm text-indigo-700/80 leading-relaxed">
          Documents help FinSarthi verify your income, category, student status, and other eligibility criteria.
          This creates a more accurate eligibility profile than manual entry alone.
        </p>
      </div>
    </div>
  );
}
