"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/api";
import { cn, formatCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STATES = [
  "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat",
  "Rajasthan", "Uttar Pradesh", "West Bengal", "Kerala", "Punjab",
];
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS", "Minority"];
const OCCUPATIONS = ["Student", "Salaried", "Farmer", "Entrepreneur", "Business", "MSME", "Retired", "Other"];

interface Props {
  initial?: Partial<UserProfile>;
  onSubmit: (profile: UserProfile) => void;
}

export default function ProfileForm({ initial, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<UserProfile>({
    full_name: initial?.full_name || "",
    age: initial?.age || 24,
    state: initial?.state || "Maharashtra",
    district: initial?.district || "",
    occupation: initial?.occupation || "Student",
    annual_income: initial?.annual_income || 180000,
    category: initial?.category || "OBC",
    gender: initial?.gender || "Male",
    business_type: initial?.business_type || null,
    is_student: initial?.is_student ?? true,
    is_farmer: initial?.is_farmer ?? false,
    uploaded_documents: initial?.uploaded_documents || [],
  });

  const update = (field: keyof UserProfile, value: unknown) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "occupation") {
        next.is_student = String(value).toLowerCase() === "student";
        next.is_farmer = String(value).toLowerCase() === "farmer";
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.full_name.trim()) e.full_name = "Name is required";
      if (form.age < 1 || form.age > 120) e.age = "Enter a valid age";
      if (!form.state) e.state = "State is required";
      if (!form.district.trim()) e.district = "District is required";
    }
    if (s === 2) {
      if (!form.occupation) e.occupation = "Occupation is required";
      if (form.annual_income < 0) e.annual_income = "Enter valid income";
      if (!form.category) e.category = "Category is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 3));
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = () => {
    if (validateStep(2) && validateStep(1)) {
      onSubmit(form);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-sm font-semibold text-indigo-600">STEP {step} OF 3</p>
        <div className="mt-2 flex gap-2">
          {["Profile", "Details", "Confirm"].map((label, i) => (
            <div key={label} className="flex-1">
              <div className={cn("h-1.5 rounded-full", i + 1 <= step ? "bg-indigo-600" : "bg-slate-200")} />
              <p className="mt-1 text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">Profile → Documents → Results</p>
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <input className="input-field" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder="Rahul Patil" />
            {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
              <input type="number" className="input-field" value={form.age} onChange={(e) => update("age", parseInt(e.target.value) || 0)} />
              {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
              <select className="select-field" value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                {["Male", "Female", "Other"].map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
              <select className="select-field" value={form.state} onChange={(e) => update("state", e.target.value)}>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">District</label>
              <input className="input-field" value={form.district} onChange={(e) => update("district", e.target.value)} placeholder="Pune" />
              {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district}</p>}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-slate-900">Eligibility Details</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Occupation</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {OCCUPATIONS.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => update("occupation", o)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                    form.occupation === o
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Annual Family Income — {formatCurrency(form.annual_income)}
            </label>
            <input
              type="range"
              min={0}
              max={2000000}
              step={10000}
              value={form.annual_income}
              onChange={(e) => update("annual_income", parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>₹0</span>
              <span>₹20L+</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update("category", c)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    form.category === c
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_student} onChange={(e) => update("is_student", e.target.checked)} className="rounded accent-indigo-600" />
              <span className="text-sm text-slate-700">Student</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_farmer} onChange={(e) => update("is_farmer", e.target.checked)} className="rounded accent-indigo-600" />
              <span className="text-sm text-slate-700">Farmer</span>
            </label>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Confirm Your Profile</h2>
          <div className="rounded-xl bg-slate-50 p-5 space-y-3 text-sm">
            {[
              ["Name", form.full_name],
              ["Age", form.age],
              ["Location", `${form.district}, ${form.state}`],
              ["Occupation", form.occupation],
              ["Income", formatCurrency(form.annual_income)],
              ["Category", form.category],
              ["Gender", form.gender],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <button onClick={back} className="btn-secondary !py-2.5">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
        ) : <div />}
        {step < 3 ? (
          <button onClick={next} className="btn-primary !py-2.5">
            Continue <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-primary !py-2.5">
            Continue to Documents <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
