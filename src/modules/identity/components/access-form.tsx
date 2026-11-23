"use client";

import { ArrowRight, LoaderCircle, Mail } from "lucide-react";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  requestAccessLink,
  type AccessState,
} from "@/modules/identity/application/auth-actions";

export function AccessForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [state, action, pending] = useActionState<AccessState, FormData>(
    requestAccessLink,
    {
      status: "idle",
      message: "",
    },
  );

  return (
    <form action={action} aria-busy={pending} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Tu correo
        </label>
        <input
          id="email"
          name="email"
          disabled={pending}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="tu@correo.com"
          className="mt-2 h-12 w-full rounded-lg border bg-card px-3 text-base"
          aria-describedby="access-help access-status"
        />
      </div>
      <Button type="submit" disabled={pending} className="h-12 w-full">
        {pending ? (
          <LoaderCircle
            aria-hidden="true"
            className="motion-safe:animate-spin"
          />
        ) : state.status === "sent" ? (
          <Mail aria-hidden="true" />
        ) : null}
        {pending
          ? "Enviando enlace…"
          : state.status === "sent"
            ? "Solicitar otro enlace"
            : "Continuar por correo"}
        {!pending && state.status !== "sent" && (
          <ArrowRight aria-hidden="true" />
        )}
      </Button>
      <p
        id="access-status"
        role="status"
        className="text-sm leading-6 text-primary"
      >
        {state.message}
      </p>
      <p id="access-help" className="text-xs leading-6 text-muted-foreground">
        Sin contraseña. Si es tu primera vez, crearemos tu cuenta al confirmar
        el correo.
      </p>
    </form>
  );
}
