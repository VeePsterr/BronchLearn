import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ProgressSummary } from "@/components/home/ProgressSummary";

const TILES = [
  { href: "/lessons/airway-orientation", title: "Start with airway anatomy", body: "A short lesson: trachea, carina, right versus left, lobar and segmental bronchi.", cta: "Start the lesson" },
  { href: "/atlas", title: "Explore the airway atlas", body: "Click any branch from the trachea to the segmental bronchi. Search by code, filter by lobe, compare variants.", cta: "Open the atlas" },
  { href: "/stations", title: "Explore EBUS stations", body: "IASLC lymph-node stations with boundaries and anatomical relationships, kept separate from modality access.", cta: "Open the station atlas" },
  { href: "/navigate", title: "Practise navigation", body: "A schematic 2-D simulator: move from the trachea to a target segment with feedback at every branch.", cta: "Start navigating" },
  { href: "/quiz", title: "Take a quiz", body: "Codes, names, routes, stations and variants. Recognized variants count as correct.", cta: "Go to the quiz centre" },
  { href: "/staging", title: "Nodal-staging learning mode", body: "Choose a hypothetical tumour side first, then reason about N1, N2 and N3.", cta: "Try an exercise" },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-semibold text-accent">{siteConfig.tagline}</p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">Welcome to {siteConfig.name}</h1>
          <p className="mt-4 text-lg text-muted">
            A calm place for medical students, residents, fellows, respiratory therapists and other trainees to learn
            bronchoscopic airway anatomy, segmental terminology and IASLC lymph-node stations. Learn the normal landmarks
            first, then test yourself.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/lessons/airway-orientation" className="rounded-lg bg-accent px-5 py-3 font-semibold text-on-accent">Start with airway anatomy</Link>
            <Link href="/atlas" className="rounded-lg border border-line bg-surface px-5 py-3 font-semibold">Open the atlas</Link>
          </div>
        </div>
        <HeroIllustration />
      </section>

      <ProgressSummary />

      <section aria-labelledby="paths-h">
        <h2 id="paths-h" className="mb-4 text-2xl font-semibold">Learning paths</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="flex h-full flex-col rounded-xl border border-line bg-surface p-5 transition-shadow hover:shadow-md">
                <span className="text-lg font-semibold">{t.title}</span>
                <span className="mt-2 flex-1 text-muted">{t.body}</span>
                <span className="mt-4 font-semibold text-accent">{t.cta} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="edu-h" className="rounded-xl border border-line bg-surface-2 p-5">
        <h2 id="edu-h" className="text-lg font-semibold">Educational use only</h2>
        <p className="mt-1 text-muted">
          {siteConfig.notice} Content is labeled by review status. Procedural sampling details are intentionally unavailable
          until reviewed by a qualified bronchoscopist. <Link className="underline" href="/about#disclaimer">Read the full disclaimer</Link>.
        </p>
      </section>
    </div>
  );
}

function HeroIllustration() {
  // Original decorative airway illustration.
  return (
    <svg viewBox="0 0 320 260" className="mx-auto w-full max-w-sm" aria-hidden="true">
      <circle cx="160" cy="130" r="120" fill="var(--accent-soft)" />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M160 30 V110" stroke="var(--ink)" strokeWidth="18" />
        <path d="M160 110 L118 140 L80 128 M118 140 L112 190 L84 214 M112 190 L122 226" stroke="var(--right)" strokeWidth="11" />
        <path d="M160 110 L208 150 L246 136 M208 150 L214 206 L190 228 M214 206 L238 222" stroke="var(--left)" strokeWidth="11" />
        <path d="M80 128 L62 98 M80 128 L52 136 M246 136 L262 104 M246 136 L272 152" stroke="var(--muted)" strokeWidth="6" />
      </g>
      <text x="40" y="60" className="fill-side-r text-[22px] font-bold">R</text>
      <text x="268" y="60" className="fill-side-l text-[22px] font-bold">L</text>
    </svg>
  );
}
