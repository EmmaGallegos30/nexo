import type { Metadata } from "next";

import { TodayOverview } from "@/modules/planning/components/today-overview";

export const metadata: Metadata = { title: "Hoy" };

export default function TodayPage() {
  return <TodayOverview />;
}
