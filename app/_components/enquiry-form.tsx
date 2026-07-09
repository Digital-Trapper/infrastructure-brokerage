"use client";

import { type FormEvent, useRef, useState } from "react";

type SubmissionState = {
  kind: "idle" | "success" | "error";
  message: string;
};

const equipmentCategories = [
  { label: "BESS / battery storage", value: "bess" },
  { label: "UPS systems", value: "ups" },
  { label: "Data centre equipment", value: "data_centre" },
  { label: "Networking equipment", value: "networking" },
  { label: "Other power infrastructure", value: "other_power" },
  { label: "Other", value: "other" },
];

const approximateValues = [
  { label: "Under £50k", value: "under_50k" },
  { label: "£50k–£250k", value: "50k_250k" },
  { label: "£250k–£1m", value: "250k_1m" },
  { label: "£1m–£5m", value: "1m_5m" },
  { label: "£5m+", value: "5m_plus" },
  { label: "Not sure", value: "not_sure" },
];

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export function EnquiryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmittingRef = useRef(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    kind: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fieldClassName =
    "mt-2 min-h-12 w-full border border-[#151512]/18 bg-[#f9f5ec] px-4 text-[#151512] outline-none transition focus:border-[#151512] focus:ring-2 focus:ring-[#7d8d76]";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmissionState({ kind: "idle", message: "" });

    try {
      const formData = new FormData(form);

      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !result.ok) {
        setSubmissionState({
          kind: "error",
          message: result.message ?? "We could not submit this enquiry. Please try again.",
        });
        return;
      }

      formRef.current?.reset();
      setSubmissionState({
        kind: "success",
        message: result.message ?? "Thanks. Your enquiry has been submitted.",
      });
    } catch {
      setSubmissionState({
        kind: "error",
        message: "We could not submit this enquiry. Please try again.",
      });
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      action="/api/enquiries"
      method="post"
      className="border border-[#151512]/12 bg-[#e7dfcf] p-6 sm:p-8"
      onSubmit={handleSubmit}
    >
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <fieldset>
        <legend className="text-sm font-medium text-[#25251f]">I&apos;m looking to</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className="flex min-h-12 items-center gap-3 border border-[#151512]/18 bg-[#f9f5ec] px-4 text-sm font-medium text-[#151512] focus-within:border-[#151512] focus-within:ring-2 focus-within:ring-[#7d8d76]">
            <input required name="enquiry_type" type="radio" value="buyer" className="h-4 w-4 accent-[#151512]" />
            <span>Buy equipment</span>
          </label>
          <label className="flex min-h-12 items-center gap-3 border border-[#151512]/18 bg-[#f9f5ec] px-4 text-sm font-medium text-[#151512] focus-within:border-[#151512] focus-within:ring-2 focus-within:ring-[#7d8d76]">
            <input required name="enquiry_type" type="radio" value="seller" className="h-4 w-4 accent-[#151512]" />
            <span>Sell equipment</span>
          </label>
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="mt-5 block">
          <span className="text-sm font-medium text-[#25251f]">Equipment type</span>
          <select required name="asset_category" defaultValue="" className={fieldClassName}>
            <option value="" disabled>
              Select equipment type
            </option>
            {equipmentCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-5 block">
          <span className="flex items-center justify-between gap-3 text-sm font-medium text-[#25251f]">
            <span>Approximate deal value</span>
            <span className="font-normal text-[#6d685c]">Optional</span>
          </span>
          <select name="approximate_value" defaultValue="" className={fieldClassName}>
            <option value="">Select range</option>
            {approximateValues.map((valueRange) => (
              <option key={valueRange.value} value={valueRange.value}>
                {valueRange.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#25251f]">Name</span>
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            className={fieldClassName}
          />
        </label>
        <label className="block">
          <span className="flex items-center justify-between gap-3 text-sm font-medium text-[#25251f]">
            <span>Company</span>
            <span className="font-normal text-[#6d685c]">Optional</span>
          </span>
          <input
            name="company"
            type="text"
            autoComplete="organization"
            className={fieldClassName}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#25251f]">Email</span>
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className={fieldClassName}
          />
        </label>
        <label className="block">
          <span className="flex items-center justify-between gap-3 text-sm font-medium text-[#25251f]">
            <span>Phone / WhatsApp</span>
            <span className="font-normal text-[#6d685c]">Optional</span>
          </span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className={fieldClassName}
          />
        </label>
      </div>
      <label className="mt-5 block">
        <span className="text-sm font-medium text-[#25251f]">Tell us about the requirement or asset</span>
        <textarea
          required
          name="message"
          rows={3}
          className="mt-2 w-full resize-y border border-[#151512]/18 bg-[#f9f5ec] px-4 py-3 text-[#151512] outline-none transition focus:border-[#151512] focus:ring-2 focus:ring-[#7d8d76]"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#151512] px-6 text-sm font-medium text-[#f4efe5] outline-none transition-colors hover:bg-[#2d342c] focus-visible:ring-2 focus-visible:ring-[#7d8d76] focus-visible:ring-offset-4 focus-visible:ring-offset-[#e7dfcf] sm:w-auto"
      >
        {isSubmitting ? "Sending..." : "Send enquiry"}
        <ArrowIcon />
      </button>
      <p
        aria-live="polite"
        className={`mt-4 text-sm ${
          submissionState.kind === "error" ? "text-[#7a241d]" : "text-[#2f5e3a]"
        }`}
      >
        {submissionState.message}
      </p>
    </form>
  );
}
