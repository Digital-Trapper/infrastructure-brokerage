import { EnquiryForm } from "./_components/enquiry-form";

const siteConfig = {
  companyName: "Gephyra Markets",
  descriptor: "Secondary Markets for Critical Infrastructure",
  email: "contact@gephyramarkets.co.uk",
  location: "London, United Kingdom",
};

const navItems = [
  { label: "Equipment", href: "#equipment" },
  { label: "Approach", href: "#approach" },
  { label: "Who We Work With", href: "#partners" },
  { label: "Contact", href: "#contact" },
];

const equipmentCategories = [
  {
    title: "Battery Energy Storage",
    text: "Containerised systems, battery racks, modules, PCS, inverters and associated equipment.",
  },
  {
    title: "Power Infrastructure",
    text: "Transformers, switchgear and high-value electrical infrastructure.",
  },
  {
    title: "Mission-Critical Power",
    text: "UPS systems and associated equipment supporting data centres and critical operations.",
  },
  {
    title: "Surplus & Replacement Equipment",
    text: "Equipment arising from upgrades, repowering programmes, site changes and asset retirement.",
  },
];

const processStages = [
  {
    title: "Assess",
    text: "We review available equipment, documentation, condition, timing and commercial context.",
  },
  {
    title: "Identify Market",
    text: "We explore potential buyers, reuse applications and relevant secondary-market routes.",
  },
  {
    title: "Facilitate",
    text: "We support introductions and commercial discussions between relevant parties.",
  },
];

const partnerTypes = [
  "Asset owners",
  "Developers",
  "Operators",
  "EPC contractors",
  "Infrastructure investors",
  "Data-centre operators",
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

function InfrastructureMotif() {
  return (
    <div
      aria-hidden="true"
      className="relative min-h-[360px] overflow-hidden border border-white/10 bg-[#111311] p-6 sm:min-h-[460px] sm:p-8"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(244,239,229,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(244,239,229,0.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-[#b8a46a]/35" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-[#b8a46a]/25" />
      <div className="absolute left-[17%] top-[19%] h-28 w-px bg-white/20" />
      <div className="absolute left-[17%] top-[19%] h-px w-[54%] bg-white/20" />
      <div className="absolute right-[18%] top-[19%] h-48 w-px bg-white/20" />
      <div className="absolute bottom-[20%] left-[26%] h-px w-[56%] bg-white/18" />
      <div className="absolute bottom-[20%] left-[26%] h-36 w-px bg-white/18" />
      <div className="absolute bottom-[20%] right-[18%] h-20 w-px bg-white/18" />
      <div className="absolute left-[14%] top-[16%] h-4 w-4 border border-[#b8a46a] bg-[#111311]" />
      <div className="absolute right-[15%] top-[16%] h-4 w-4 border border-[#b8a46a] bg-[#111311]" />
      <div className="absolute bottom-[17%] left-[23%] h-4 w-4 border border-[#b8a46a] bg-[#111311]" />
      <div className="absolute bottom-[17%] right-[15%] h-4 w-4 border border-[#b8a46a] bg-[#111311]" />
      <div className="absolute left-[34%] top-[37%] h-24 w-40 border border-white/15 bg-[#171a17]/80 shadow-2xl shadow-black/30" />
      <div className="absolute left-[39%] top-[44%] h-10 w-28 border border-[#b8a46a]/45" />
      <div className="absolute right-[15%] top-[43%] h-32 w-24 border border-white/15 bg-[#171a17]/80" />
      <div className="absolute right-[18%] top-[49%] h-20 w-12 border-x border-[#b8a46a]/35" />
      <div className="absolute bottom-[27%] left-[12%] h-20 w-32 border border-white/15 bg-[#171a17]/80" />
      <div className="absolute bottom-[33%] left-[17%] h-px w-14 bg-[#b8a46a]/45" />
      <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between border-t border-white/10 pt-4 text-[0.65rem] uppercase tracking-[0.28em] text-white/45">
        <span>Reuse</span>
        <span>Resale</span>
        <span>Remarketing</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4efe5] text-[#151512]">
      <header className="sticky top-0 z-50 border-b border-[#151512]/10 bg-[#f4efe5]/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <a
            href="#top"
            className="outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#7d8d76] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4efe5]"
          >
            <span className="block text-sm font-semibold uppercase tracking-[0.22em] text-[#151512]">
              {siteConfig.companyName}
            </span>
          </a>
          <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-[#4b4a43] outline-none transition-colors hover:text-[#151512] focus-visible:ring-2 focus-visible:ring-[#7d8d76] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4efe5]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="inline-flex min-h-10 items-center border border-[#151512] px-4 text-sm font-medium text-[#151512] outline-none transition-colors hover:bg-[#151512] hover:text-[#f4efe5] focus-visible:ring-2 focus-visible:ring-[#7d8d76] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4efe5]"
            >
              Discuss an asset
            </a>
          </nav>
        </div>
      </header>

      <section id="top" className="border-b border-[#151512]/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-28">
          <div>
            <p className="mb-8 max-w-xl text-sm uppercase tracking-[0.26em] text-[#737065]">
              {siteConfig.descriptor}
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] text-[#151512] sm:text-6xl lg:text-7xl">
              Unlocking secondary-market value from surplus energy infrastructure
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#4b4a43] sm:text-xl">
              We help asset owners identify potential reuse, resale and remarketing routes for surplus
              BESS, power and mission-critical infrastructure equipment.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#151512] px-6 text-sm font-medium text-[#f4efe5] outline-none transition-colors hover:bg-[#2d342c] focus-visible:ring-2 focus-visible:ring-[#7d8d76] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4efe5]"
              >
                Discuss an asset
                <ArrowIcon />
              </a>
              <a
                href="#equipment"
                className="inline-flex min-h-12 items-center justify-center border border-[#151512]/20 px-6 text-sm font-medium text-[#151512] outline-none transition-colors hover:border-[#151512] focus-visible:ring-2 focus-visible:ring-[#7d8d76] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4efe5]"
              >
                Explore equipment categories
              </a>
            </div>
          </div>
          <InfrastructureMotif />
        </div>
      </section>

      <section className="bg-[#151512] px-5 py-6 text-[#f4efe5] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm uppercase tracking-[0.22em] text-[#d3c9b7] sm:flex-row sm:items-center sm:justify-between">
          <span>Supporting opportunities arising from repowering, augmentation, upgrades and asset retirement</span>
          <span className="hidden h-px flex-1 bg-white/14 sm:block" />
        </div>
      </section>

      <section id="equipment" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#7d8d76]">Equipment</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Specialist focus across energy storage and critical power infrastructure
            </h2>
          </div>
          <div className="grid gap-px border border-[#151512]/12 bg-[#151512]/12 sm:grid-cols-2">
            {equipmentCategories.map((category) => (
              <article key={category.title} className="bg-[#f4efe5] p-7 transition-colors hover:bg-[#ebe3d3]">
                <h3 className="text-xl font-semibold text-[#151512]">{category.title}</h3>
                <p className="mt-5 leading-7 text-[#5d5a50]">{category.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="approach" className="border-y border-[#151512]/10 bg-[#e7dfcf] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-[#697661]">Approach</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">A measured route to market</h2>
          </div>
          <div className="mt-14 grid gap-px border border-[#151512]/12 bg-[#151512]/12 lg:grid-cols-3">
            {processStages.map((stage, index) => (
              <article key={stage.title} className="bg-[#e7dfcf] p-7">
                <span className="text-sm uppercase tracking-[0.2em] text-[#8d7a4f]">0{index + 1}</span>
                <h3 className="mt-8 text-2xl font-semibold">{stage.title}</h3>
                <p className="mt-5 leading-7 text-[#5d5a50]">{stage.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="partners" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[#7d8d76]">Who We Work With</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            Built for asset-side, project-side and capital-side conversations
          </h2>
        </div>
        <ul className="grid gap-px border border-[#151512]/12 bg-[#151512]/12 sm:grid-cols-2">
          {partnerTypes.map((partner) => (
            <li key={partner} className="bg-[#f4efe5] px-6 py-5 text-lg font-medium text-[#25251f]">
              {partner}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-[#151512] px-5 py-20 text-[#f4efe5] sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.1fr]">
          <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Replacement does not always mean end of commercial utility
          </h2>
          <div className="space-y-6 text-lg leading-8 text-[#d3c9b7]">
            <p>
              Infrastructure equipment may retain potential value or utility beyond its first deployment.
              Commercial options can depend on specification, documentation, condition, timing, logistics
              and the requirements of potential secondary users.
            </p>
            <p>
              Early consideration of secondary-market routes may create additional options before equipment
              automatically enters disposal or recycling pathways.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[#7d8d76]">Contact</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            Planning an upgrade, repowering programme or equipment replacement?
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#5d5a50]">
            We would be interested in discussing potential secondary-market routes for surplus equipment.
          </p>
        </div>
        <EnquiryForm email={siteConfig.email} />
      </section>

      <footer className="border-t border-[#151512]/10 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-[#5d5a50] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold uppercase tracking-[0.2em] text-[#151512]">{siteConfig.companyName}</p>
            <p className="mt-2 text-[#25251f]">{siteConfig.descriptor}</p>
            <p className="mt-2">
              {siteConfig.location} ·{" "}
              <a className="underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </p>
          </div>
          <a id="privacy-note" className="underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}?subject=Privacy%20enquiry`}>
            Privacy
          </a>
        </div>
      </footer>
    </main>
  );
}
