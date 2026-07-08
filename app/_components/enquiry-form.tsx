type EnquiryFormProps = {
  email: string;
};

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

  return (
    <form action={mailtoHref} method="post" encType="text/plain" className="border border-[#151512]/12 bg-[#e7dfcf] p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-[#25251f]">Name</span>
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            className="mt-2 min-h-12 w-full border border-[#151512]/18 bg-[#f9f5ec] px-4 text-[#151512] outline-none transition focus:border-[#151512] focus:ring-2 focus:ring-[#7d8d76]"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#25251f]">Company</span>
          <input
            required
            name="company"
            type="text"
            autoComplete="organization"
            className="mt-2 min-h-12 w-full border border-[#151512]/18 bg-[#f9f5ec] px-4 text-[#151512] outline-none transition focus:border-[#151512] focus:ring-2 focus:ring-[#7d8d76]"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#25251f]">Work email</span>
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className="mt-2 min-h-12 w-full border border-[#151512]/18 bg-[#f9f5ec] px-4 text-[#151512] outline-none transition focus:border-[#151512] focus:ring-2 focus:ring-[#7d8d76]"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#25251f]">Equipment type</span>
          <input
            required
            name="equipment_type"
            type="text"
            className="mt-2 min-h-12 w-full border border-[#151512]/18 bg-[#f9f5ec] px-4 text-[#151512] outline-none transition focus:border-[#151512] focus:ring-2 focus:ring-[#7d8d76]"
          />
        </label>
      </div>
      <label className="mt-5 block">
        <span className="text-sm font-medium text-[#25251f]">Message</span>
        <textarea
          required
          name="message"
          rows={6}
          className="mt-2 w-full resize-y border border-[#151512]/18 bg-[#f9f5ec] px-4 py-3 text-[#151512] outline-none transition focus:border-[#151512] focus:ring-2 focus:ring-[#7d8d76]"
        />
      </label>
      <button
        type="submit"
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#151512] px-6 text-sm font-medium text-[#f4efe5] outline-none transition-colors hover:bg-[#2d342c] focus-visible:ring-2 focus-visible:ring-[#7d8d76] focus-visible:ring-offset-4 focus-visible:ring-offset-[#e7dfcf] sm:w-auto"
      >
        Discuss an asset
        <ArrowIcon />
      </button>
      <p className="mt-4 text-sm leading-6 text-[#6d685c]">
        This first-version form opens an email draft and can be connected to a dedicated form
        service later.
      </p>
    </form>
  );
}
