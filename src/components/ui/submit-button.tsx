"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Spinner } from "@/components/ui/spinner";
import { primaryButtonClass, secondaryButtonClass, dangerButtonClass } from "@/lib/ui";

const VARIANT_CLASS = {
  primary: primaryButtonClass,
  secondary: secondaryButtonClass,
  danger: dangerButtonClass,
};

// Bottone di invio per i form collegati a una Server Action. Prima ogni
// pagina usava un <button type="submit"> statico: durante il round-trip al
// server (query al database, in genere qualche centinaio di millisecondi,
// più su connessioni lente) il bottone restava cliccabile e senza nessun
// segnale visivo, quindi l'utente lo premeva di nuovo pensando che il primo
// click non fosse partito — nel migliore dei casi un click sprecato, nel
// peggiore una riga creata due volte.
//
// Niente useFormStatus qui: quell'hook richiede React 19 (in React 18 era
// disponibile solo nelle build canary), mentre questo progetto è fermo a
// react-dom 18.3.1 stabile, dove l'hook non esiste — usarlo avrebbe rotto
// ogni pagina con un form al primo render. Al suo posto ci si aggancia
// all'evento nativo "submit" del <form> più vicino: appena l'utente invia
// (click sul bottone o Invio da tastiera) il bottone si disabilita e mostra
// lo spinner. La quasi totalità di questi form, a successo, fa redirect o
// revalidatePath, quindi la pagina si ricarica/rimonta e lo stato torna
// pulito da solo; se la Server Action fallisce senza navigare, il bottone
// può restare disabilitato finché l'utente non naviga altrove — meno
// preciso del reset automatico di useFormStatus, ma senza dover toccare
// React o Next. Va usato come figlio diretto (o indiretto) di un
// <form action={...}>, mai al suo posto.
export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const handleSubmit = () => setPending(true);
    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
  }, []);

  return (
    <button
      ref={ref}
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={clsx(VARIANT_CLASS[variant], className)}
    >
      {pending && <Spinner />}
      {pending ? pendingLabel ?? children : children}
    </button>
  );
}
