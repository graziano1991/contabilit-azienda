import { NavDock } from "@/components/nav-dock";

// Guscio dell'app: prima conteneva una colonna fissa (sidebar) + una
// striscia in alto (topbar) attorno al contenuto. Ora la navigazione vive
// tutta dentro NavDock (su desktop occupa spazio reale nel flusso della
// pagina — "sticky", non "fixed" — così il contenuto la segue senza bisogno
// di padding indovinati; su mobile resta una barra sottile "fixed"): niente
// più stato da tenere qui (cassetto mobile, rail compresso/espanso). Il
// contenuto scorre normalmente con la pagina, non più in un riquadro a
// scroll indipendente: l'aurora animata di sfondo è comunque fixed su
// <body>, quindi resta ferma dietro a tutto durante lo scroll esattamente
// come prima.
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
      {/* Su desktop il dock è "sticky" (occupa spazio reale nel flusso),
          quindi qui basta un piccolo distacco estetico. Su mobile il dock
          resta "fixed" (barra sottile sempre in cima), quindi il contenuto
          ha bisogno di un padding che ne compensi l'altezza per non finirci
          sotto. */}
      <main className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-20 sm:px-6 md:pt-6">
        {children}
      </main>
    </div>
  );
}
