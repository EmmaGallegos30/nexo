"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { savePreferences } from "@/modules/identity/application/preferences-action";

export function PreferencesForm({
  displayName,
  workspaceName,
  timeZone,
}: {
  displayName: string;
  workspaceName: string;
  timeZone: string;
}) {
  const [values, setValues] = useState({
    displayName,
    workspaceName,
    timeZone,
  });
  const [state, action, pending] = useActionState(savePreferences, {
    message: "",
    success: false,
  });

  return (
    <form action={action} aria-busy={pending} className="max-w-lg space-y-6">
      <div>
        <label htmlFor="displayName" className="text-sm font-medium">
          Cómo te llamamos
        </label>
        <input
          id="displayName"
          name="displayName"
          disabled={pending}
          autoComplete="name"
          maxLength={80}
          value={values.displayName}
          onChange={(event) =>
            setValues({ ...values, displayName: event.target.value })
          }
          className="mt-2 h-11 w-full rounded-lg border px-3"
        />
      </div>
      <div>
        <label htmlFor="workspaceName" className="text-sm font-medium">
          Nombre de tu espacio
        </label>
        <input
          id="workspaceName"
          name="workspaceName"
          disabled={pending}
          required
          maxLength={60}
          value={values.workspaceName}
          onChange={(event) =>
            setValues({ ...values, workspaceName: event.target.value })
          }
          className="mt-2 h-11 w-full rounded-lg border px-3"
        />
      </div>
      <div>
        <label htmlFor="timeZone" className="text-sm font-medium">
          Zona horaria
        </label>
        <input
          id="timeZone"
          name="timeZone"
          disabled={pending}
          required
          maxLength={80}
          list="time-zones"
          value={values.timeZone}
          onChange={(event) =>
            setValues({ ...values, timeZone: event.target.value })
          }
          aria-describedby="time-zone-help"
          className="mt-2 h-11 w-full rounded-lg border px-3"
        />
        <datalist id="time-zones">
          {[
            "America/Mexico_City",
            "America/Cancun",
            "America/Monterrey",
            "America/Matamoros",
            "America/Chihuahua",
            "America/Ciudad_Juarez",
            "America/Ojinaga",
            "America/Hermosillo",
            "America/Mazatlan",
            "America/Tijuana",
          ].map((zone) => (
            <option key={zone} value={zone} />
          ))}
        </datalist>
        <p
          id="time-zone-help"
          className="mt-2 text-xs leading-6 text-muted-foreground"
        >
          Valor inicial: Ciudad de México. Cámbialo si tu horario es distinto.
          Puedes usar otra zona IANA válida.
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Idioma: Español (México) · Moneda: MXN
      </p>
      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Guardar cambios"}
      </Button>
      <p role="status" className="text-sm leading-6">
        {state.message}
      </p>
    </form>
  );
}
