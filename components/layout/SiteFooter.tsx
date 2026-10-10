import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface text-sm text-muted">
      <div className="mx-auto grid max-w-6xl gap-2 px-4 py-6 sm:flex sm:items-center sm:justify-between">
        <p>
          {siteConfig.name} · content version {siteConfig.contentVersion} ({siteConfig.contentDate}) · original
          schematic illustrations
        </p>
        <p className="flex gap-4">
          <a className="underline" href="/about#sources">Sources</a>
          <a className="underline" href={siteConfig.feedbackUrl} rel="noopener noreferrer" target="_blank">
            Report an anatomy error
          </a>
        </p>
      </div>
    </footer>
  );
}
