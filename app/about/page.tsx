import type { Metadata } from "next";
import { AIRWAYS } from "@/content/airways/airways";
import { REVIEW_HISTORY } from "@/content/review/history";
import { SOURCES } from "@/content/sources/registry";
import { STATIONS } from "@/content/stations/stations";
import { NODAL_RULES } from "@/content/staging/nodalRules";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { ReviewBadge } from "@/components/ui/ReviewBadge";
import { STATUS_EXPLANATION } from "@/lib/content/display";
import { REVIEW_STATUSES } from "@/lib/contentSchemas";

export const metadata: Metadata = { title: "About & sources" };

const ACCESS_LABEL = { "accessed-text": "Accessed (text)", "partially-accessed": "Partially accessed", "not-accessible": "Not accessible" } as const;

function count(statuses: string[]) {
  return REVIEW_STATUSES.map((s) => ({ s, n: statuses.filter((x) => x === s).length }));
}

export default function AboutPage() {
  const airway = count(AIRWAYS.map((a) => a.meta.reviewStatus));
  const stationAnat = count(STATIONS.map((s) => s.reviewStatus));
  const stationAccess = count(STATIONS.map((s) => s.accessibleBy.meta.reviewStatus));
  const nodal = count(NODAL_RULES.map((r) => r.meta.reviewStatus));
  return (
    <>
      <PageHeader title="About & sources" intro={`${siteConfig.name} is an education-only website. This page explains what it is, what it is not, where its content comes from and how that content is reviewed.`} />
      <div className="prose-lesson max-w-3xl space-y-10">
        <section id="disclaimer" aria-labelledby="disclaimer-h" className="rounded-xl border-2 border-draft bg-draft-soft p-5">
          <h2 id="disclaimer-h" className="!mt-0">Educational disclaimer</h2>
          <p><strong>{siteConfig.notice}</strong></p>
          <ul>
            <li>{siteConfig.name} is not clinical decision support, not a substitute for supervised procedural training, and not patient-specific medical advice.</li>
            <li>All illustrations are original schematics. They are not to scale and do not show true anatomical positions, bronchoscopic orientation or patient anatomy.</li>
            <li>No location on any airway wall is presented as universally safe to biopsy. Sampling decisions are patient-specific and depend on imaging, ultrasound findings, vascular anatomy, Doppler assessment, operator judgment and local practice.</li>
            <li>Needle-entry locations, clock-face positions, sampling windows, vascular avoidance, numbers of passes, sedation, specimen handling and procedural safety instructions are deliberately not provided.</li>
            <li>N-category exercises use hypothetical scenarios to teach terminology and are not staging advice.</li>
            <li>Content marked <em>Draft – unverified</em> has not been checked against an authoritative source and must not be relied on.</li>
          </ul>
        </section>

        <section aria-labelledby="version-h">
          <h2 id="version-h">Medical-content version</h2>
          <p>Content version <strong>{siteConfig.contentVersion}</strong>, last reviewed {siteConfig.contentDate}.</p>
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Review status counts</caption>
            <thead><tr className="border-b border-line"><th scope="col" className="py-1">Content</th>{REVIEW_STATUSES.map((s) => <th key={s} scope="col"><ReviewBadge status={s} compact /></th>)}</tr></thead>
            <tbody>
              {[
                ["Airway structures", airway],
                ["Station anatomy", stationAnat],
                ["Station modality access", stationAccess],
                ["N-category rules", nodal],
              ].map(([label, rows]) => (
                <tr key={label as string} className="border-b border-line">
                  <th scope="row" className="py-1 font-medium">{label as string}</th>
                  {(rows as { s: string; n: number }[]).map((r) => <td key={r.s}>{r.n}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section aria-labelledby="method-h">
          <h2 id="method-h">Content-review methodology</h2>
          <ol>
            <li>Medical content lives in typed data files under <code>/content</code>, separate from the interface, and is validated by automated tests.</li>
            <li>Every content object carries source references, a review status, a review date, a reviewer name or role, and notes on uncertainty and variation.</li>
            <li>Review statuses:
              <ul>{REVIEW_STATUSES.map((s) => <li key={s}><ReviewBadge status={s} compact /> {STATUS_EXPLANATION[s]}</li>)}</ul>
            </li>
            <li>Clinically sensitive procedural fields are stored separately and are only displayed once clinician-reviewed with a named reviewer, role, date and source. None are currently displayed.</li>
            <li>Video lectures that inspired the teaching sequence were not accessible to this project and are not treated as sources.</li>
          </ol>
        </section>

        <section aria-labelledby="history-h">
          <h2 id="history-h">Content-review history</h2>
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-line"><th scope="col" className="py-1">Date</th><th scope="col">Version</th><th scope="col">Reviewer</th><th scope="col">Scope</th></tr></thead>
            <tbody>
              {REVIEW_HISTORY.map((r) => (
                <tr key={r.date + r.version} className="border-b border-line align-top">
                  <td className="py-1">{r.date}</td><td>{r.version}</td><td>{r.reviewer}</td><td>{r.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="sources" aria-labelledby="sources-h">
          <h2 id="sources-h">Reference registry</h2>
          <ul className="!list-none !pl-0 space-y-4">
            {SOURCES.map((s) => (
              <li key={s.id} id={`src-${s.id}`} className="rounded-xl border border-line bg-surface p-4">
                <p className="!my-0 font-semibold">{s.shortTitle}</p>
                <p className="!my-1 text-sm">{s.citation}</p>
                <p className="!my-1 text-sm"><a href={s.url} rel="noopener noreferrer" target="_blank">{s.url}</a></p>
                <p className="!my-1 text-sm">
                  <strong>{ACCESS_LABEL[s.accessStatus]}</strong> on {s.accessedDate} · {s.authoritative ? "Authoritative source" : "Teaching inspiration only (not a source of medical facts)"}
                </p>
                <p className="!my-1 text-sm text-muted">{s.accessNotes}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="copyright-h">
          <h2 id="copyright-h">Copyright and asset attribution</h2>
          <ul>
            <li>All diagrams (airway tree, simulated learning view, station map, logo) are original SVG drawings created for this project. They were not traced or adapted from any published figure, video frame or website image.</li>
            <li>No footage, screenshots, narration, transcripts, diagrams or branding from the ATS or CTSNet videos are used. The videos are listed only as acknowledged teaching inspiration for the order of topics.</li>
            <li>Anatomical terms are from Terminologia Anatomica (FIPAT); station definitions are paraphrased or quoted briefly from the IASLC lymph node map for education, with citation.</li>
            <li>No third-party images, icon fonts or web fonts are bundled. Open-source software licences are listed in <code>package-lock.json</code>.</li>
          </ul>
        </section>

        <section aria-labelledby="privacy-h">
          <h2 id="privacy-h">Privacy</h2>
          <p>{siteConfig.name} has no accounts, analytics or server-side storage. Quiz scores and visited items are saved only in your browser&apos;s local storage. It never asks for names, email addresses, patient data or case identifiers.</p>
        </section>

        <section aria-labelledby="feedback-h">
          <h2 id="feedback-h">Report an anatomy error</h2>
          <p>Found an error? <a href={siteConfig.feedbackUrl} rel="noopener noreferrer" target="_blank">Report it here</a>. Please describe the page and the content, and do not include any patient information.</p>
        </section>
      </div>
    </>
  );
}
