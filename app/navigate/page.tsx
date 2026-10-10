import type { Metadata } from "next";
import { NavigationSimulator } from "@/components/sim/NavigationSimulator";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Navigation simulator" };

export default function NavigatePage() {
  return (
    <>
      <PageHeader
        title="Simulated bronchoscopy navigation"
        intro="A two-dimensional, schematic simulation for learning the order of branches from the trachea to the segmental bronchi. It is not a patient-specific view and does not show real orientation."
      />
      <NavigationSimulator />
    </>
  );
}
