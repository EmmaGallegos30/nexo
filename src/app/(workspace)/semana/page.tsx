import type { Metadata } from "next";

import { WeekOverview } from "@/modules/planning/components/week-overview";

export const metadata: Metadata = { title: "Semana" };

export default function WeekPage() {
  return <WeekOverview />;
}
