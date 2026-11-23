import type { Metadata } from "next";

import { UniversityOverview } from "@/modules/university/components/university-overview";

export const metadata: Metadata = { title: "Universidad" };

export default function UniversityPage() {
  return <UniversityOverview />;
}
