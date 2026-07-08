type EnquiryFormProps = {
  email: string;
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

export function EnquiryForm({ email }: EnquiryFormProps) {
  const mailtoHref = `mailto:${email}?subject=Secondary-market%20equipment%20discussion`;
  const fieldClassName =
    "mt-2 min-h-12 w-full border border-[#151512]/18 bg-[#f9f5ec] px-4 text-[#151512] outline-none transition focus:border-[#151512] focus:ring-2 focus:ring-[#7d8d76]";

  return (
    <form action={mailtoHref} method="post" encType="text/plain" className="border border-[#151512]/12 bg-[#e7dfcf] p-6 sm:p-8">
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
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#151512] px-6 text-sm font-medium text-[#f4efe5] outline-none transition-colors hover:bg-[#2d342c] focus-visible:ring-2 focus-visible:ring-[#7d8d76] focus-visible:ring-offset-4 focus-visible:ring-offset-[#e7dfcf] sm:w-auto"
      >
        Send enquiry
        <ArrowIcon />
      </button>
    </form>
  );
}
