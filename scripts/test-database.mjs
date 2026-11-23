import { spawn, spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { once } from "node:events";

// Always a new, disposable cluster. Never read production database URLs.
const config = spawnSync("pg_config", ["--bindir"], { encoding: "utf8" });
if (config.status !== 0) {
  console.error(
    "Instala PostgreSQL local (initdb/postgres/pg_config) para ejecutar test:db. No se conectará a una base existente.",
  );
  process.exit(1);
}
const binaries = config.stdout.trim();
const directory = await mkdtemp(
  join(process.env.NEXO_TEST_TMPDIR ?? tmpdir(), "nexo-db-"),
);
let server;
try {
  const initialized = spawnSync(
    join(binaries, "initdb"),
    [
      "-D",
      directory,
      "-A",
      "trust",
      "--no-locale",
      "--encoding=UTF8",
      "--username=nexo_test_admin",
    ],
    { encoding: "utf8" },
  );
  if (initialized.status !== 0)
    throw new Error("No se pudo inicializar el PostgreSQL temporal.");

  const portReservation = createServer();
  portReservation.listen(0, "127.0.0.1");
  await once(portReservation, "listening");
  const port = portReservation.address().port;
  await new Promise((resolve, reject) =>
    portReservation.close((error) => (error ? reject(error) : resolve())),
  );

  server = spawn(
    join(binaries, "postgres"),
    ["-D", directory, "-h", "127.0.0.1", "-p", String(port), "-k", "", "-F"],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  await new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(
      () => reject(new Error("PostgreSQL temporal no inició a tiempo.")),
      30_000,
    );
    server.stderr.on("data", (chunk) => {
      output += chunk.toString();
      if (output.includes("database system is ready to accept connections")) {
        clearTimeout(timer);
        resolve();
      }
    });
    server.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    server.once("exit", () => {
      clearTimeout(timer);
      reject(new Error("PostgreSQL temporal se cerró durante el inicio."));
    });
  });

  const adminUrl = `postgres://nexo_test_admin@127.0.0.1:${port}/postgres`;
  const appUrl = `postgres://nexo_app:temporary-test-only@127.0.0.1:${port}/postgres`;
  const child = spawn(
    process.execPath,
    [
      "node_modules/vitest/vitest.mjs",
      "run",
      "--config",
      "vitest.integration.config.ts",
    ],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: appUrl,
        TEST_DATABASE_ADMIN_URL: adminUrl,
      },
    },
  );
  const [exitCode] = await once(child, "exit");
  process.exitCode = exitCode ?? 1;
} finally {
  if (server && server.exitCode === null && server.signalCode === null) {
    const exited = once(server, "exit");
    server.kill("SIGINT");
    await exited;
  }
  // Only remove the exact directory allocated above, never an existing database.
  const marker = await readFile(join(directory, "PG_VERSION"), "utf8").catch(
    () => null,
  );
  if (marker) await rm(directory, { recursive: true });
}
