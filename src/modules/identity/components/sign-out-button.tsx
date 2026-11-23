"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" disabled={pending}>
      {pending ? "Cerrando sesión…" : "Cerrar sesión"}
    </Button>
  );
}
