import postgres from "postgres";

import { getMigrationDatabaseUrl } from "../src/config/migration-environment";
import { getRuntimeDatabaseUrl } from "../src/config/database-environment";

async function provision() {
  const runtime = new URL(getRuntimeDatabaseUrl(process.env));
  if (!runtime.password) {
    throw new Error("DATABASE_URL debe usar nexo_app y una contraseña propia.");
  }
  const admin = postgres(getMigrationDatabaseUrl(process.env), {
    max: 1,
    prepare: false,
  });
  try {
    await admin.begin(async (transaction) => {
      const [role] =
        await transaction`select rolsuper, rolbypassrls, rolcreaterole, rolcreatedb, rolinherit from pg_roles where rolname = 'nexo_app'`;
      if (!role || Object.values(role).some(Boolean))
        throw new Error(
          "El rol nexo_app debe existir y no tener privilegios administrativos.",
        );
      // PostgreSQL utility statements cannot bind a password parameter directly.
      // format(%L) quotes it in the database; never interpolate or log it ourselves.
      const [statement] = await transaction<
        { command: string }[]
      >`select format('ALTER ROLE nexo_app LOGIN PASSWORD %L', ${decodeURIComponent(runtime.password)}::text) as command`;
      if (!statement) throw new Error("No se pudo preparar el rol.");
      await transaction.unsafe(statement.command);
    });
    console.log(
      "Rol de aplicación aprovisionado. Verifica ahora la conexión y RLS.",
    );
  } finally {
    await admin.end();
  }
}

provision().catch(() => {
  // Database errors may contain SQL, including credentials. Do not print them.
  console.error(
    "No se pudo aprovisionar nexo_app. Revisa las migraciones, el rol y las dos URLs según docs/supabase.md.",
  );
  process.exitCode = 1;
});
