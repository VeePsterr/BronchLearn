import type { Metadata } from "next";
import { AirwayAtlas } from "@/components/anatomy/AirwayAtlas";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Airway atlas" };

export default function AtlasPage() {
  return (
    <>
      <PageHeader
        title="Airway atlas"
        intro="Explore the tracheobronchial tree from the trachea to the segmental bronchi. Select a branch to see its code, name, side, lobe, path and sources."
      />
      <AirwayAtlas />
    </>
  );
}
