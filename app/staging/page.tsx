import type { Metadata } from "next";
import { StagingExercise } from "@/components/ebus/StagingExercise";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Nodal staging learning mode" };

export default function StagingPage() {
  return (
    <>
      <PageHeader
        title="Nodal-staging learning mode"
        intro="A lymph-node station has no fixed N category. Pick a hypothetical primary-tumour side, then reason about whether involvement of a station would be N1, N2 or N3. This is a terminology exercise, not guidance on managing patients."
      />
      <StagingExercise />
    </>
  );
}
