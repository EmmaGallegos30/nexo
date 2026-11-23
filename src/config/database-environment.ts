import { isSecurePostgresUrl } from "./postgres-url";

export function getRuntimeDatabaseUrl(
  environment: Record<string, string | undefined>,
) {
  const value = environment.DATABASE_URL ?? "";
  try {
    const url = new URL(value);
    if (
      !isSecurePostgresUrl(value) ||
      decodeURIComponent(url.username).split(".")[0] !== "nexo_app"
    )
      throw new Error();
    return value;
  } catch {
    throw new Error(
      "DATABASE_URL debe ser una conexión PostgreSQL del rol restringido nexo_app, nunca del propietario o migrador. Fuera de loopback exige sslmode=verify-full.",
    );
  }
}
