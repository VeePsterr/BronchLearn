import type { Metadata } from "next";
import { NavigationSimulator } from "@/components/sim/NavigationSimulator";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Navigation simulator" };

export default function NavigatePage() {
  return (
    <>
      <PageHeader
        title="Simulated bronchoscopy navigation"
        intro="A computer-generated simulation for learning the order of branches from the trachea to the segmental bronchi, shown with the patient's left on the left of the screen. It is not a patient image, and opening positions are approximate and awaiting clinician review."
      />
      <NavigationSimulator />
    </>
  );
}
