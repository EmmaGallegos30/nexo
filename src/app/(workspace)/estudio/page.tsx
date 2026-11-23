import type { Metadata } from "next";

import { StudyOverview } from "@/modules/study/components/study-overview";

export const metadata: Metadata = { title: "Estudio" };

export default function StudyPage() {
  return <StudyOverview />;
}
