# Migraciones

El esquema en `src/server/db/schema/` contiene perfiles, espacios y membresías de
D1 dentro del esquema privado `nexo`. `auth.users` es una referencia externa que
pertenece a Supabase, no una tabla gestionada por nuestras migraciones.

- `npm run db:generate`: genera SQL/snapshots desde el esquema, sin credenciales.
- `npm run db:migrate`: aplica migraciones usando exclusivamente
  `DATABASE_MIGRATION_URL`. Configurar según [la guía](../docs/supabase.md).
- `npm run db:provision`: habilita LOGIN y establece la contraseña de `nexo_app`
  desde el entorno privado, después de migrar. Nunca se versiona esa contraseña.
- Revisar y versionar el SQL generado, incluidas sus políticas, roles y permisos.
  No usar `drizzle-kit push` como sustituto de migraciones revisadas.

`0000_identity.sql` incluye un preámbulo/epílogo revisado manualmente: rol,
permisos mínimos, aislamiento de los roles públicos y RLS forzado. Drizzle genera
políticas, pero no esos privilegios administrativos ni el contexto de identidad.
Conservar snapshot/journal y revisar estos aspectos al generar nuevas tablas.

La conexión de migración tiene privilegios que **nunca** debe tener runtime.
`withUserDatabase` exige `nexo_app` sin privilegios administrativos/propiedad y fija
`nexo.user_id` localmente a la transacción. Las pruebas `npm run test:db` verifican
SQL real y reutilización de conexiones; la conexión/pooler remoto debe verificarse
al configurar Supabase. No hay buckets ni acceso público a tablas en D1.
