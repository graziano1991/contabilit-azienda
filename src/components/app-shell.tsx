import { NavDock } from "@/components/nav-dock";

// Guscio dell'app: prima conteneva una colonna fissa (sidebar) + una
// striscia in alto (topbar) attorno al contenuto. Ora la navigazione è un
// dock flottante che sta SOPRA il contenuto (position fixed, gestito da
// NavDock) invece di occupare una colonna a fianco: niente più stato da
// tenere qui (cassetto mobile, rail compresso/espanso) — vive tutto dentro
// NavDock stesso. Il contenuto scorre normalmente con la pagina, non più
// in un riquadro a scroll indipendente: l'aurora animata di sfondo è
// comunque fixed su <body>, quindi resta ferma dietro a tutto durante lo
// scroll esattamente come prima.
export function AppShell({
  companyName,
  userEmail,
  children,
}: {
  companyName: string;
  userEmail: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full">
      <NavDock companyName={companyName} userEmail={userEmail} />
      <main className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-20 sm:px-6 md:pt-28">
        {children}
      </main>
    </div>
  );
}
