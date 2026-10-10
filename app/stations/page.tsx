import type { Metadata } from "next";
import { StationAtlas } from "@/components/ebus/StationAtlas";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "EBUS lymph-node station atlas" };

export default function StationsPage() {
  return (
    <>
      <PageHeader
        title="EBUS lymph-node station atlas"
        intro="Learn the IASLC thoracic lymph-node stations and their anatomical relationships. Station identification, modality access and patient-specific sampling decisions are three different questions; each card keeps them separate."
      />
      <StationAtlas />
    </>
  );
}
