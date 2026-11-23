export function isSecurePostgresUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    const modes = url.searchParams.getAll("sslmode");
    return (
      ["postgres:", "postgresql:"].includes(url.protocol) &&
      url.hostname.length > 0 &&
      url.pathname.length > 1 &&
      (local || (modes.length === 1 && modes[0] === "verify-full"))
    );
  } catch {
    return false;
  }
}
