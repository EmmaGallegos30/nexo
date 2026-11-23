# D1 — Configurar Supabase remoto

La aplicación usa enlaces de correo sin contraseña, sesiones SSR y PostgreSQL
con un rol de servidor separado. **No pegues contraseñas, URLs privadas ni claves
en el chat o en archivos versionados.**

## 1. Crear o seleccionar el proyecto

En Supabase, crea tú un proyecto de desarrollo o selecciona uno destinado a Nexo.
Conserva su contraseña PostgreSQL de forma privada. No ejecutes estas migraciones
en una base compartida sin revisarlas: crean el esquema privado `nexo` y el rol
reservado `nexo_app`.

No necesitas Docker ni claves `service_role` para ejecutar la aplicación.

## 2. Configurar el entorno

Copiar `.env.example` a `.env.local` y completar:

| Variable                               | Qué configurar                                                               |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | URL del proyecto, desde Connect/API                                          |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave publishable; se admite una anon JWT antigua, nunca secret/service role |
| `APP_URL`                              | Origen canónico, inicialmente `http://localhost:3000`, sin ruta              |
| `DATABASE_MIGRATION_URL`               | Conexión PostgreSQL administrativa de migraciones                            |
| `DATABASE_URL`                         | Conexión con usuario `nexo_app` y contraseña diferente, elegida por ti       |

La URL de migraciones utiliza la conexión directa o el pooler en **modo sesión**
apropiado para DDL. En una red solo IPv4 puede ser necesario el pooler de sesión.
No usar el modo transacción como conexión administrativa de migración.

Para runtime puede utilizarse el pooler de transacciones. Copia su host, puerto y
base desde Connect, sustituyendo el usuario por `nexo_app.<project-ref>` si ese
pooler utiliza el sufijo del proyecto; en conexión directa el usuario es
`nexo_app`. La contraseña del rol se aprovisiona en el paso 4.

En ambas conexiones remotas se exige `sslmode=verify-full` con una cadena de
confianza válida; `require` cifra pero no verifica el certificado en este driver.
Si el proveedor exige una CA propia, configúrala de forma segura para Node (por
ejemplo mediante `NODE_EXTRA_CA_CERTS` al iniciar el proceso). Codifica
los caracteres reservados de usuario/contraseña al formar una URL. No desactives
la verificación de certificados para ocultar un error de configuración.

## 3. Configurar correo y redirecciones

En Authentication:

1. Habilitar Email y registro de usuarios para el entorno de desarrollo.
2. En URL Configuration, poner Site URL igual a `APP_URL`.
3. Permitir exactamente `http://localhost:3000/auth/callback` para desarrollo.
4. Mantener los enlaces basados en `{{ .ConfirmationURL }}` en las plantillas
   Magic Link y Confirm Signup. Supabase completa la verificación y redirige con
   un código de autorización a `/auth/callback`.
5. No cambiar la plantilla a un endpoint `token_hash` sin implementar ese flujo:
   esta versión utiliza **PKCE y `exchangeCodeForSession`**.

Solicita el enlace desde `APP_URL` y ábrelo en **el mismo navegador y perfil**. El
verificador PKCE está en una cookie HTTP-only. Si solicitas varios enlaces, usa el
más reciente. No mezcles `localhost` y `127.0.0.1`.

En producción usar HTTPS y añadir la URL exacta del callback del dominio. Configurar
SMTP y límites de envío antes de una beta pública. El servicio de correo por
defecto de Supabase tiene restricciones de destinatarios y frecuencia: revisar
el dashboard si no llega el enlace. La aplicación no imprime el error del
proveedor ni revela la existencia de una cuenta.

## 4. Migrar y aprovisionar el rol de runtime

Primero revisar `drizzle/0000_identity.sql` y ejecutar:

```bash
npm run db:migrate
```

La migración crea tablas/políticas/permisos y `nexo_app` inicialmente **NOLOGIN**.
No contiene ninguna contraseña. No crea ni modifica `auth.users`, que pertenece
a Supabase.

Después de completar `DATABASE_URL` con una contraseña propia, ejecutar:

```bash
npm run db:provision
```

El script usa la conexión administrativa para habilitar LOGIN y asignar al rol la
contraseña de `DATABASE_URL`, sin imprimirla. Se puede volver a ejecutar para
rotarla, actualizando antes la variable privada. No utiliza la contraseña de
migraciones como fallback y no incorpora credenciales a SQL versionado.

La aplicación valida que runtime conecte como `nexo_app`, sin SUPERUSER,
BYPASSRLS, CREATEROLE, CREATEDB, INHERIT, otras membresías de rol ni propiedad de
tablas de `nexo`. Una conexión administrativa puesta por error en `DATABASE_URL`
es rechazada.

## 5. Ejecutar y validar el flujo remoto

```bash
npm run dev
```

Visitar `APP_URL`. Las rutas del espacio requieren autenticación. Sin configuración
válida se muestra `/acceso` con instrucciones, sin bypass ni datos simulados.

Checklist manual requerido para cerrar D1 contra tu proyecto:

- [ ] Solicitar enlace, recibirlo y confirmar acceso en el mismo navegador.
- [ ] Ver un solo perfil, espacio y membresía; recargar/reintentar no los duplica.
- [ ] Guardar nombre de espacio, nombre personal y zona horaria en Mi cuenta;
      recargar y comprobar persistencia.
- [ ] Abrir otra cuenta en un perfil/navegador independiente; comprobar espacios
      distintos y ausencia de datos de la primera cuenta.
- [ ] Verificar renovación de sesión y que las respuestas sean privadas/no-store.
- [ ] Cerrar sesión en este navegador; volver atrás/recargar no concede acceso.
- [ ] Abrir un enlace vencido, reutilizado o en otro navegador: error recuperable.
- [ ] Probar conexión/pooling remoto con el rol de runtime, no solo con el dueño.

Sin variables remotas, este checklist **no está verificado**. Las pruebas locales
de PostgreSQL no sustituyen la entrega real del correo ni las políticas del
proveedor remoto.

## 6. Modelo y fronteras de seguridad

- `nexo.profiles`: preferencias del usuario; email permanece en Supabase Auth.
- `nexo.workspaces`: un espacio personal por propietario.
- `nexo.memberships`: una membresía personal; FK compuesta exige que usuario y
  propietario del espacio coincidan. Colaboración necesita una migración futura.
- Tablas con RLS forzado y permisos mínimos. Runtime puede insertar/leer registros
  propios y modificar solo columnas de preferencias/nombre. No puede cambiar
  propietarios, editar membresías ni eliminar identidades.
- El servidor valida al usuario mediante `auth.getUser()` y comprueba membresía.
  Cada operación DB fija `nexo.user_id` usando `set_config(..., true)` dentro de su
  transacción; el contexto se elimina al terminar o hacer rollback.
- Ese contexto es una afirmación del **servidor confiable**, no una credencial
  pública. Quien robe la contraseña de runtime podría suplantarlo; nunca se
  entrega al navegador ni se aceptan IDs de usuario del formulario.
- El esquema `nexo` no se expone por Data API y sus roles `anon`/`authenticated` no
  reciben acceso. No añadirlo a schemas expuestos. No hay acceso directo desde el
  navegador a tablas, ni clientes de aplicación con credenciales administrativas.
- No hay buckets ni subidas habilitadas en D1. Antes de incorporar archivos se
  requieren buckets privados, políticas por espacio, validación de pertenencia y
  pruebas cruzadas. **No utilizar un bucket público como atajo.**

Al añadir tablas en D2, revisar SQL generado: `workspace_id`, FKs compatibles con
el espacio, grants mínimos y políticas RLS. Drizzle no configura automáticamente
la identidad de Supabase ni los privilegios de tus roles.

## 7. Pruebas automatizadas sin credenciales remotas

```bash
npm run check
npm run test:db
npm run test:e2e
```

`test:db` requiere PostgreSQL local con `pg_config`, `initdb` y `postgres`. Crea un
cluster temporal aislado en loopback, aplica la migración real y prueba dos
identidades, bootstrap concurrente, permisos, FK, RLS y reutilización de conexión
tras commit/rollback. Solo la tabla/roles de Auth se preparan como prerrequisitos;
**no hay un servidor Supabase Auth simulado que cuente como prueba remota**.
Nunca usa URLs de producción y elimina únicamente el cluster que acaba de crear.

Los E2E normales cubren acceso público, rutas protegidas y callbacks inválidos con
la configuración de proveedor vacía de forma intencional. No existe una variable
de bypass de autenticación. La UI autenticada y el correo remoto se validan con
el checklist del paso 5.
