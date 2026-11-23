import type { Metadata } from "next";

import { FinanceOverview } from "@/modules/finances/components/finance-overview";

export const metadata: Metadata = { title: "Finanzas" };

export default function FinancePage() {
  return <FinanceOverview />;
}
