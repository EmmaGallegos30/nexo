import "server-only";

import { and, eq } from "drizzle-orm";

import {
  preferencesSchema,
  type PreferencesInput,
} from "@/modules/identity/domain/preferences";
import { memberships, profiles, workspaces } from "@/server/db/schema";
import {
  withUserDatabase,
  type UserTransaction,
} from "@/server/db/user-database";
import type { VerifiedIdentity } from "@/server/supabase/identity";

async function readPersonalSpace(
  transaction: UserTransaction,
  identity: VerifiedIdentity,
) {
  const [space] = await transaction
    .select({ workspace: workspaces, profile: profiles })
    .from(memberships)
    .innerJoin(
      workspaces,
      and(
        eq(workspaces.id, memberships.workspaceId),
        eq(workspaces.ownerUserId, memberships.userId),
      ),
    )
    .innerJoin(profiles, eq(profiles.userId, memberships.userId))
    .where(eq(memberships.userId, identity.id))
    .limit(1);
  return space;
}

export async function ensurePersonalSpace(identity: VerifiedIdentity) {
  return withUserDatabase(identity, async (transaction) => {
    const existing = await readPersonalSpace(transaction, identity);
    if (existing) return existing;
    await transaction
      .insert(profiles)
      .values({ userId: identity.id })
      .onConflictDoNothing();
    await transaction
      .insert(workspaces)
      .values({ ownerUserId: identity.id })
      .onConflictDoNothing();
    const [workspace] = await transaction
      .select()
      .from(workspaces)
      .where(eq(workspaces.ownerUserId, identity.id));
    if (!workspace) throw new Error("No se pudo preparar el espacio personal.");

    await transaction
      .insert(memberships)
      .values({ workspaceId: workspace.id, userId: identity.id })
      .onConflictDoNothing();
    const space = await readPersonalSpace(transaction, identity);
    if (!space)
      throw new Error("No se pudo verificar la membresía del espacio.");
    return space;
  });
}

export async function updatePersonalPreferences(
  identity: VerifiedIdentity,
  input: PreferencesInput,
) {
  const values = preferencesSchema.parse(input);
  return withUserDatabase(identity, async (transaction) => {
    const [membership] = await transaction
      .select({ workspaceId: memberships.workspaceId })
      .from(memberships)
      .where(eq(memberships.userId, identity.id));
    if (!membership)
      throw new Error("No se pudo verificar la membresía del espacio.");
    const [workspace] = await transaction
      .update(workspaces)
      .set({ name: values.workspaceName })
      .where(
        and(
          eq(workspaces.ownerUserId, identity.id),
          eq(workspaces.id, membership.workspaceId),
        ),
      )
      .returning({ id: workspaces.id });
    const [profile] = await transaction
      .update(profiles)
      .set({
        displayName: values.displayName || null,
        timeZone: values.timeZone,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, identity.id))
      .returning({ id: profiles.userId });
    if (!workspace || !profile)
      throw new Error("No se pudo actualizar tu espacio.");
  });
}
