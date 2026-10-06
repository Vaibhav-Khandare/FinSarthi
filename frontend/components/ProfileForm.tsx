"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/api";
import { cn, formatCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Check, MapPin, User, BriefcaseBusiness, ShieldCheck } from "lucide-react";

const STATES = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "West Bengal",
  "Kerala",
  "Punjab",
];

const CATEGORIES = [
  "General",
  "OBC",
  "SC",
  "ST",
  "EWS",
  "Minority",
];

const OCCUPATIONS = [
  "Student",
  "Salaried",
  "Farmer",
  "Entrepreneur",
  "Business",
  "MSME",
  "Retired",
  "Other",
];

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

      // KEEPING ORIGINAL BACKEND LOGIC
      if (field === "occupation") {
        next.is_student = String(value).toLowerCase() === "student";
        next.is_farmer = String(value).toLowerCase() === "farmer";
      }

      return next;
    });

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};

    if (s === 1) {
      if (!form.full_name.trim()) {
        e.full_name = "Name is required";
      }

      if (form.age < 1 || form.age > 120) {
        e.age = "Enter a valid age";
      }

      if (!form.state) {
        e.state = "State is required";
      }

      if (!form.district.trim()) {
        e.district = "District is required";
      }
    }

    if (s === 2) {
      if (!form.occupation) {
        e.occupation = "Occupation is required";
      }

      if (form.annual_income < 0) {
        e.annual_income = "Enter valid income";
      }

      if (!form.category) {
        e.category = "Category is required";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 3));
    }
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(2) && validateStep(1)) {
      onSubmit(form);
    }
  };

  const steps = [
    {
      number: 1,
      label: "Profile",
      description: "Personal details",
      icon: User,
    },
    {
      number: 2,
      label: "Eligibility",
      description: "Scheme details",
      icon: BriefcaseBusiness,
    },
    {
      number: 3,
      label: "Confirm",
      description: "Review profile",
      icon: Check,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl">

      {/* Main Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

        {/* Top Accent */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

        {/* Stepper */}
        <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-6 sm:px-8">
          <div className="flex items-center justify-between">

            {steps.map((item, index) => {
              const Icon = item.icon;
              const active = step === item.number;
              const completed = step > item.number;

              return (
                <div
                  key={item.number}
                  className="flex flex-1 items-center"
                >
                  <div className="flex items-center gap-3">

                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300",
                        active &&
                          "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/25",
                        completed &&
                          "border-emerald-500 bg-emerald-500 text-white",
                        !active &&
                          !completed &&
                          "border-slate-200 bg-white text-slate-400"
                      )}
                    >
                      {completed ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>

                    <div className="hidden sm:block">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          active || completed
                            ? "text-slate-900"
                            : "text-slate-400"
                        )}
                      >
                        {item.label}
                      </p>

                      <p className="text-xs text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="mx-3 h-px flex-1 bg-slate-200 sm:mx-5">
                      <div
                        className={cn(
                          "h-full transition-all duration-500",
                          step > item.number
                            ? "bg-emerald-500"
                            : "bg-transparent"
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Step Label */}
          <div className="mt-5 flex items-center justify-between sm:hidden">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Step {step} of 3
              </p>
              <p className="text-xs text-slate-400">
                {steps[step - 1].description}
              </p>
            </div>

            <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              {Math.round((step / 3) * 100)}%
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-5 py-7 sm:px-8 sm:py-9">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-in fade-in duration-300 space-y-7">

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <div className="h-8 w-1 rounded-full bg-blue-600" />
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Personal Information
                  </h2>
                </div>

                <p className="ml-3 text-sm text-slate-500">
                  Tell us a little about yourself to personalize your results.
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  className={cn(
                    "w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400",
                    "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                    errors.full_name
                      ? "border-red-400"
                      : "border-slate-200"
                  )}
                  value={form.full_name}
                  onChange={(e) =>
                    update("full_name", e.target.value)
                  }
                  placeholder="Enter your full name"
                />

                {errors.full_name && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {errors.full_name}
                  </p>
                )}
              </div>

              {/* Age + Gender */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Age
                  </label>

                  <input
                    type="number"
                    className={cn(
                      "w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all",
                      "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                      errors.age
                        ? "border-red-400"
                        : "border-slate-200"
                    )}
                    value={form.age}
                    onChange={(e) =>
                      update(
                        "age",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />

                  {errors.age && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.age}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Gender
                  </label>

                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    value={form.gender}
                    onChange={(e) =>
                      update("gender", e.target.value)
                    }
                  >
                    {["Male", "Female", "Other"].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-semibold text-slate-800">
                    Location
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-500">
                      State
                    </label>

                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      value={form.state}
                      onChange={(e) =>
                        update("state", e.target.value)
                      }
                    >
                      {STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-500">
                      District
                    </label>

                    <input
                      className={cn(
                        "w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400",
                        "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                        errors.district
                          ? "border-red-400"
                          : "border-slate-200"
                      )}
                      value={form.district}
                      onChange={(e) =>
                        update("district", e.target.value)
                      }
                      placeholder="e.g. Pune"
                    />

                    {errors.district && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {errors.district}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-in fade-in duration-300 space-y-8">

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <div className="h-8 w-1 rounded-full bg-indigo-600" />

                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Eligibility Details
                  </h2>
                </div>

                <p className="ml-3 text-sm text-slate-500">
                  These details help FinSarthi find relevant government schemes.
                </p>
              </div>

              {/* Occupation */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    What best describes you?
                  </label>

                  <span className="text-xs text-slate-400">
                    Select one
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {OCCUPATIONS.map((o) => {
                    const selected = form.occupation === o;

                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() =>
                          update("occupation", o)
                        }
                        className={cn(
                          "group relative rounded-xl border px-3 py-3.5 text-sm font-semibold transition-all duration-200",
                          selected
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-slate-50"
                        )}
                      >
                        {selected && (
                          <span className="absolute right-2 top-2">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          </span>
                        )}

                        {o}
                      </button>
                    );
                  })}
                </div>

                {errors.occupation && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {errors.occupation}
                  </p>
                )}
              </div>

              {/* Income */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">

                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Annual Family Income
                    </label>

                    <p className="mt-1 text-xs text-slate-400">
                      Approximate yearly household income
                    </p>
                  </div>

                  <div className="shrink-0 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
                    <p className="text-sm font-bold text-indigo-600">
                      {formatCurrency(form.annual_income)}
                    </p>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={2000000}
                  step={10000}
                  value={form.annual_income}
                  onChange={(e) =>
                    update(
                      "annual_income",
                      parseInt(e.target.value)
                    )
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-full accent-indigo-600"
                />

                <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                  <span>₹0</span>
                  <span>₹5L</span>
                  <span>₹10L</span>
                  <span>₹20L+</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <div className="mb-3">
                  <label className="text-sm font-semibold text-slate-700">
                    Social Category
                  </label>

                  <p className="mt-1 text-xs text-slate-400">
                    Select the category applicable to you
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {CATEGORIES.map((c) => {
                    const selected = form.category === c;

                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          update("category", c)
                        }
                        className={cn(
                          "rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all",
                          selected
                            ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
                        )}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>

                {errors.category && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Removed Student/Farmer checkboxes intentionally */}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="animate-in fade-in duration-300 space-y-7">

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                  <Check className="h-7 w-7 text-emerald-600" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Review Your Profile
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Make sure your information is correct before continuing.
                </p>
              </div>

              {/* Summary */}
              <div className="overflow-hidden rounded-2xl border border-slate-200">

                {[
                  ["Name", form.full_name],
                  ["Age", form.age],
                  [
                    "Location",
                    `${form.district}, ${form.state}`,
                  ],
                  ["Occupation", form.occupation],
                  [
                    "Annual Income",
                    formatCurrency(form.annual_income),
                  ],
                  ["Category", form.category],
                  ["Gender", form.gender],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className={cn(
                      "flex items-center justify-between gap-4 px-5 py-4",
                      index % 2 === 0
                        ? "bg-slate-50/70"
                        : "bg-white"
                    )}
                  >
                    <span className="text-sm text-slate-500">
                      {label}
                    </span>

                    <span className="text-right text-sm font-semibold text-slate-900">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Trust Card */}
              <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Ready to find your schemes
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700/80">
                    FinSarthi will use these details along with your
                    documents to identify relevant government benefits.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-9 flex items-center justify-between border-t border-slate-100 pt-6">

            {step > 1 ? (
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/25 active:translate-y-0"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/25 active:translate-y-0"
              >
                Continue to Documents
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Trust */}
      <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4" />
        Your information is used to personalize your scheme recommendations.
      </div>
    </div>
  );
}