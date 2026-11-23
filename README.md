# Nexo SecondBrain

SaaS personal para organizar universidad, aprendizaje y finanzas con menos
fricción. D0 establece la base técnica; D1 incorpora acceso por enlace de correo,
espacio personal y aislamiento PostgreSQL. El cierre de D1 requiere configurar y
validar el proyecto Supabase remoto. Tareas y finanzas funcionales llegan después.

## Empezar

- Node.js **24 LTS recomendado** (`.nvmrc`); también se admite Node 26.
- npm 11. Dependencias fijadas en `package.json` y `package-lock.json`.

```bash
npm ci
npm run dev
```

Abrir <http://localhost:3000>. Sin variables válidas se muestra el acceso pendiente
de configurar; las rutas privadas permanecen protegidas. El build y las pruebas
unitarias funcionan sin Supabase. Las fuentes utilizan la pila del sistema.

Para habilitar autenticación y persistencia, seguir
[docs/supabase.md](./docs/supabase.md): `.env.local`, correo/redirecciones,
migraciones y rol restringido. No compartir claves por el chat.

Si utilizas nvm, ejecuta `nvm use` antes de instalar. Para servir una compilación
de producción, ejecutar `npm run build` y después `npm start`.

## Comandos

| Comando                | Función                                          |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Desarrollo local                                 |
| `npm run build`        | Compilación de producción                        |
| `npm start`            | Servir compilación existente                     |
| `npm run lint`         | ESLint, sin advertencias permitidas              |
| `npm run typecheck`    | Generar tipos de rutas y verificar TypeScript    |
| `npm test`             | Pruebas unitarias                                |
| `npm run test:watch`   | Pruebas unitarias en modo observación            |
| `npm run format`       | Formatear código y documentación técnica         |
| `npm run format:check` | Verificar formato                                |
| `npm run check`        | Formato, lint, tipos, unitarias y build          |
| `npm run test:e2e`     | Build y pruebas de navegador desktop/móvil       |
| `npm run test:db`      | PostgreSQL temporal: migraciones, permisos y RLS |
| `npm run db:generate`  | Generar migraciones locales, sin conexión        |
| `npm run db:migrate`   | Aplicar migraciones con credenciales separadas   |
| `npm run db:provision` | Configurar LOGIN/contraseña del rol de runtime   |

Antes del primer E2E, instalar el navegador:

```bash
npx playwright install chromium
npm run test:e2e
```

Los E2E usan un servidor de producción propio en `127.0.0.1:3100`; ese puerto debe
estar libre. Cubren rutas públicas, protección sin sesión y callbacks inválidos,
con proveedor intencionalmente sin configurar; no sustituyen un acceso remoto
real ni utilizan un bypass de autenticación.

`npm run test:db` requiere `pg_config`, `initdb` y `postgres` locales. Arranca un
cluster nuevo, aplica SQL real, aprovisiona el rol y comprueba aislamiento y
reutilización de conexiones. Nunca conecta a una base existente. Estas pruebas
verifican PostgreSQL, no el correo ni el servicio Supabase Auth remoto.

## Rutas disponibles

| Ruta             | Vista                                                   |
| ---------------- | ------------------------------------------------------- |
| `/`              | Hoy                                                     |
| `/semana`        | Semana, dentro del contexto Hoy                         |
| `/universidad`   | Universidad                                             |
| `/estudio`       | Estudio extracurricular                                 |
| `/finanzas`      | Finanzas, sin saldos ficticios                          |
| `/cuenta`        | Preferencias y cierre de sesión                         |
| `/acceso`        | Entrada pública por enlace de correo                    |
| `/auth/callback` | Intercambio del código PKCE, sin redirecciones externas |

Hoy, Semana, Universidad, Estudio y Finanzas conservan sus estados vacíos. Captura
llega en D2 y calendario funcional en D3. Ahora el espacio y las preferencias son
persistentes cuando existe configuración real. Todas esas rutas y Mi cuenta
requieren usuario verificado y membresía. Las respuestas son privadas/no-store y
la indexación sigue desactivada; no se simula una sesión o un saldo.

## Estructura

```text
src/
  app/                Rutas y layouts de Next.js App Router
  components/
    layout/           Shell, navegación y encabezados
    shared/           Estados compartidos
    ui/               Componentes propios con patrones de shadcn/ui
  config/             Navegación y validación de configuración
  lib/                Utilidades pequeñas compartidas
  modules/
    planning/         Hoy y Semana
    university/       Universidad
    study/            Estudio extracurricular
    finances/         Finanzas personales
    identity/         Reglas, casos de uso y UI de identidad/preferencias
  server/
    db/               Transacciones autenticadas y esquema Drizzle
    supabase/         Adaptador SSR e identidad verificada
  proxy.ts            Renovación de cookies y protección temprana
drizzle/              SQL, políticas y snapshot versionados
scripts/              Aprovisionamiento y PostgreSQL de pruebas
tests/e2e/            Protección pública/privada en navegador
tests/integration/    Pruebas reales de PostgreSQL/RLS
docs/supabase.md      Configuración remota y checklist de aceptación
```

Las rutas componen módulos. Interfaz, casos de uso y persistencia se separarán al
existir lógica real; no se crean capas vacías para todos los dominios. Compras,
inteligencia y suscripciones se añadirán en sus entregas.

## Configuración de D1: Supabase y migraciones

Copiar `.env.example` a `.env.local`. Mantenerlo fuera de Git; el ejemplo contiene
solo nombres/comentarios y el origen local. Guía completa:
[docs/supabase.md](./docs/supabase.md).

| Variable                               | Uso futuro                                                |
| -------------------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | URL del proyecto Supabase                                 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave pública; nunca service role                         |
| `APP_URL`                              | Origen canónico para el callback; HTTPS fuera de loopback |
| `DATABASE_URL`                         | Rol de runtime restringido con RLS                        |
| `DATABASE_MIGRATION_URL`               | Conexión separada para migraciones                        |

- `drizzle.config.ts` genera SQL sin cargar credenciales. El esquema `nexo`
  contiene perfiles, espacios y membresías; `auth.users` pertenece a Supabase.
- `drizzle.migrate.config.ts` carga configuración local y exige una URL PostgreSQL
  de migración válida. No utiliza `DATABASE_URL` como sustituto.
- La migración crea `nexo_app` sin LOGIN. `db:provision` asigna la contraseña de
  runtime de forma separada, sin escribirla en SQL versionado.
- **Drizzle no hereda la identidad de Supabase.** El servidor obtiene una identidad
  verificada, verifica membresía y fija contexto local dentro de cada transacción.
  Runtime rechaza roles administrativos, propietarios de tablas o con membresías.
  Ver [drizzle/README.md](./drizzle/README.md).

El destino previsto es Vercel + Supabase. No se han aprovisionado recursos remotos
desde esta sesión ni activado cobros o proveedores de IA/telemetría. Las credenciales
remotas las configura el usuario; la aceptación completa figura en la guía.

## Decisiones de base

- Next.js 16, React 19, TypeScript 5.9 y Tailwind 4; versiones exactas en el lockfile.
- npm por ser la herramienta ya disponible; Node 24 es la base de desarrollo
  recomendada. TypeScript 5.9 mantiene una base conservadora para las herramientas.
- Estilos neutros con verde de acento, fuentes del sistema y navegación accesible.
- Componentes de UI locales y configuración de shadcn; no una biblioteca de
  componentes opaca ni un backend separado.
- ESLint 9 se fija por compatibilidad con los peers de los plugins incluidos en
  `eslint-config-next`. npm marca esa rama de ESLint como fuera de soporte;
  revisar la migración a ESLint 10 cuando esos plugins lo admitan. El lint de D0
  se verifica sin advertencias.
- Dos overrides transitivos corrigen alertas de herramientas: esbuild 0.25.12
  dentro de `@esbuild-kit/core-utils` y minimatch 11.0.8 dentro de
  `@typescript-eslint/typescript-estree`. Se verifican generación Drizzle y lint;
  revisar su necesidad al actualizar los paquetes de origen. `npm audit` permite
  comprobar el estado del árbol completo.
- No hay CI remoto configurado ni commits automáticos. Ejecutar checks localmente
  y conectar CI cuando exista repositorio remoto.

## Continuar el proyecto

1. Leer el resumen de [nexo-secondbrain.md](./nexo-secondbrain.md).
2. Consultar estado y entrega activa en
   [entregables-y-requisitos.md](./entregables-y-requisitos.md).
3. Implementar y verificar solo ese alcance; actualizar el registro de continuidad.

Los dos documentos de producto se excluyen del formateo automático para conservar
su estructura de lectura. No editar la planificación externa: la referencia vive
en este proyecto.
