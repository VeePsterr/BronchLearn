import type { Metadata } from "next";
import { GlossarySearch } from "@/components/glossary/GlossarySearch";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Glossary" };

export default function GlossaryPage() {
  return (
    <>
      <PageHeader title="Glossary" intro="Key terms with their sources and review status. The full reference registry is on the About & sources page." />
      <GlossarySearch />
    </>
  );
}
