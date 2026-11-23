import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Nexo — Una cosa a la vez", template: "%s | Nexo" },
  description:
    "Un espacio para organizar tu universidad, aprender con dirección y tomar mejores decisiones financieras.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
