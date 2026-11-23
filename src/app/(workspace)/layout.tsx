import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { requirePersonalSpace } from "@/server/supabase/identity";

export const dynamic = "force-dynamic";

export default async function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { workspace } = await requirePersonalSpace();
  return <AppShell workspaceName={workspace.name}>{children}</AppShell>;
}
