import { z } from "zod";
import { isSecurePostgresUrl } from "./postgres-url";

const migrationUrlSchema = z.string().trim().refine(isSecurePostgresUrl);

export function getMigrationDatabaseUrl(
  environment: Record<string, string | undefined>,
): string {
  const result = migrationUrlSchema.safeParse(
    environment.DATABASE_MIGRATION_URL,
  );

  if (!result.success) {
    // Never include connection strings or validation input in error output.
    throw new Error(
      "Configura DATABASE_MIGRATION_URL con una URL de PostgreSQL válida en .env.local. Fuera de loopback exige sslmode=verify-full; debe estar separada de DATABASE_URL.",
    );
  }

  return result.data;
}
