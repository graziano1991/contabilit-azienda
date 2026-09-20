"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Home,
  Hotel,
  Repeat,
  BookOpen,
  ListTree,
  FileText,
  Users,
  Truck,
  Wallet,
  Landmark,
  Banknote,
  Percent,
  CalendarClock,
  BarChart3,
  FolderOpen,
  Settings,
  ChevronDown,
  Building,
  UserCog,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/lib/supabase/client";

type NavLeaf = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  basePath: string;
  items: NavLeaf[];
};

type NavEntry = NavLeaf | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

const NAV: NavEntry[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Immobili",
    icon: Building2,
    basePath: "/immobili",
    items: [
      { label: "Tutte le realtà", href: "/immobili", icon: Building2 },
      { label: "Affitti Brevi", href: "/immobili/affitti-brevi", icon: Home },
      { label: "Appartamenti", href: "/immobili/appartamenti", icon: Building },
      { label: "Hotel / Strutture", href: "/immobili/hotel", icon: Hotel },
    ],
  },
  {
    label: "Compravendite",
    icon: Repeat,
    basePath: "/compravendite",
    items: [
      { label: "Operazioni", href: "/compravendite", icon: Repeat },
      { label: "Acquisti", href: "/compravendite/acquisti", icon: Repeat },
      { label: "Vendite", href: "/compravendite/vendite", icon: Repeat },
    ],
  },
  {
    label: "Contabilità",
    icon: BookOpen,
    basePath: "/contabilita",
    items: [
      { label: "Prima Nota", href: "/contabilita/prima-nota", icon: BookOpen },
      { label: "Piano dei Conti", href: "/contabilita/piano-dei-conti", icon: ListTree },
      { label: "Fatture", href: "/contabilita/fatture", icon: FileText },
      { label: "Clienti", href: "/contabilita/clienti", icon: Users },
      { label: "Fornitori", href: "/contabilita/fornitori", icon: Truck },
      { label: "Pagamenti", href: "/contabilita/pagamenti", icon: Wallet },
      { label: "Banche", href: "/contabilita/banche", icon: Landmark },
      { label: "Cassa", href: "/contabilita/cassa", icon: Banknote },
      { label: "IVA", href: "/contabilita/iva", icon: Percent },
      { label: "Scadenze", href: "/contabilita/scadenze", icon: CalendarClock },
    ],
  },
  { label: "Report", href: "/report", icon: BarChart3 },
  { label: "Documenti", href: "/documenti", icon: FolderOpen },
  { label: "Utenti", href: "/impostazioni/utenti", icon: UserCog },
  { label: "Impostazioni", href: "/impostazioni", icon: Settings },
];

function initialsFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const cleaned = local.replace(/[^a-zA-Z0-9]/g, "");
  return cleaned.slice(0, 2).toUpperCase() || "?";
}

// Sostituisce completamente il vecchio concetto di sidebar verticale fissa:
// qui la navigazione è un dock flottante in alto, staccato dai bordi dello
// schermo, che non occupa più una colonna fissa di larghezza a fianco del
// contenuto. Le voci con sotto-sezioni aprono un pannello a comparsa sotto
// la propria icona invece di un accordion incassato in una barra laterale.
// Su mobile diventa una barra sottile + un overlay a schermo intero.
export function NavDock({
  companyName,
  userEmail,
}: {
  companyName: string;
  userEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Cambio pagina: chiude qualunque pannello/overlay aperto, anche se la
  // navigazione è avvenuta in un altro modo (indietro/avanti del browser).
  useEffect(() => {
    setOpenGroup(null);
    setAccountOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Blocca lo scroll della pagina sotto mentre il menu mobile a schermo
  // intero è aperto, per evitare il doppio-scroll sgradevole.
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const anyDesktopPanelOpen = Boolean(openGroup) || accountOpen;

  return (
    <>
      {/* Dock flottante desktop: "sticky", non "fixed" — occupa spazio reale
          nel flusso della pagina invece di sovrapporsi al contenuto, così
          non serve indovinare un padding-top per non finirci sotto, e se le
          voci vanno a capo su schermi più stretti il contenuto sotto si
          sposta di conseguenza invece di restare nascosto. Due righe fisse
          (identità+account sopra, navigazione sotto) invece di un'unica riga
          compressa: le etichette non vengono più troncate su schermi meno
          larghi, semplicemente la riga di navigazione va a capo. */}
      <div className="sticky top-4 z-40 hidden justify-center px-4 md:flex">
        <nav className="glass-panel relative flex w-full max-w-7xl flex-col gap-2 rounded-2xl px-4 py-3 shadow-ambient">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/dashboard"
              className="flex shrink-0 items-center gap-2 rounded-xl px-1 py-0.5 transition-opacity hover:opacity-80"
            >
              <Image
                src="/logo.png"
                alt="FinanzaCore"
                width={28}
                height={28}
                className="h-7 w-7 shrink-0 rounded-lg shadow-glow"
                priority
              />
              <span className="whitespace-nowrap text-sm font-semibold text-white">
                FinanzaCore
              </span>
            </Link>

            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                aria-label="Menu account"
                aria-expanded={accountOpen}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-premium-gradient text-xs font-semibold text-white shadow-glow ring-1 ring-inset ring-white/15 transition-transform duration-150 ease-snappy hover:-translate-y-px active:translate-y-0 active:scale-95"
              >
                {initialsFromEmail(userEmail)}
              </button>

              {accountOpen && (
                <div className="glass-panel absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 overflow-hidden rounded-2xl p-1.5 shadow-card animate-fade-in-up">
                  <div className="px-3 py-2.5">
                    <p className="truncate text-sm font-medium text-neutral-900">{userEmail}</p>
                    <p className="text-xs text-neutral-500">{companyName}</p>
                  </div>
                  <div className="my-1 h-px bg-white/10" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-cost transition-colors duration-150 hover:bg-rose-500/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Esci
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 border-t border-white/10 pt-2">
            {NAV.map((entry) => {
              if (!isGroup(entry)) {
                const Icon = entry.icon;
                const active = pathname === entry.href;
                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className={clsx(
                      "flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-premium-gradient-soft text-white shadow-inner-glow ring-1 ring-inset ring-white/10"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className={clsx("h-4 w-4 shrink-0", active && "text-accent-600")} />
                    <span>{entry.label}</span>
                  </Link>
                );
              }

              const Icon = entry.icon;
              const groupActive = pathname.startsWith(entry.basePath);
              const isOpen = openGroup === entry.label;

              return (
                <div key={entry.label} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenGroup(isOpen ? null : entry.label)}
                    className={clsx(
                      "flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-150",
                      groupActive || isOpen
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className={clsx("h-4 w-4 shrink-0", groupActive && "text-accent-600")} />
                    <span>{entry.label}</span>
                    <ChevronDown
                      className={clsx(
                        "h-3 w-3 shrink-0 text-white/40 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="glass-panel absolute left-0 top-[calc(100%+0.5rem)] z-50 w-60 overflow-hidden rounded-2xl p-1.5 shadow-card animate-fade-in-up">
                      {entry.items.map((item) => {
                        const ItemIcon = item.icon;
                        const active = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                              "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-150",
                              active
                                ? "bg-white/10 font-medium text-accent-700"
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                          >
                            <ItemIcon className="h-3.5 w-3.5 shrink-0" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Scrim invisibile: chiude il pannello di gruppo o il menu account
          aperti cliccando fuori, senza dover gestire listener globali. */}
      {anyDesktopPanelOpen && (
        <div
          className="fixed inset-0 z-30 hidden md:block"
          aria-hidden="true"
          onClick={() => {
            setOpenGroup(null);
            setAccountOpen(false);
          }}
        />
      )}

      {/* Barra sottile mobile: logo, avatar, hamburger. Il menu vero e
          proprio è l'overlay a schermo intero qui sotto. */}
      <div className="glass-surface fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 px-4 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="FinanzaCore"
            width={28}
            height={28}
            className="h-7 w-7 rounded-lg shadow-glow"
            priority
          />
          <span className="text-sm font-semibold text-white">FinanzaCore</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAccountOpen((v) => !v)}
            aria-label="Menu account"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-premium-gradient text-[11px] font-semibold text-white shadow-glow ring-1 ring-inset ring-white/15 active:scale-95"
          >
            {initialsFromEmail(userEmail)}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Apri menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 active:scale-95"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tendina account su mobile: stesso pannello del desktop, ancorato
          sotto la barra sottile invece che dentro il dock. */}
      {accountOpen && (
        <div className="fixed inset-x-4 top-16 z-50 md:hidden">
          <div className="glass-panel ml-auto w-64 overflow-hidden rounded-2xl p-1.5 shadow-card animate-fade-in-up">
            <div className="px-3 py-2.5">
              <p className="truncate text-sm font-medium text-neutral-900">{userEmail}</p>
              <p className="text-xs text-neutral-500">{companyName}</p>
            </div>
            <div className="my-1 h-px bg-white/10" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-cost transition-colors duration-150 hover:bg-rose-500/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Esci
            </button>
          </div>
        </div>
      )}
      {accountOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-hidden="true"
          onClick={() => setAccountOpen(false)}
        />
      )}

      {/* Overlay a schermo intero: sostituisce il cassetto laterale di
          prima. Nessuna colonna fissa da tenere: il menu copre tutto,
          l'utente sceglie e torna al contenuto. */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#07050f]/98 backdrop-blur-xl md:hidden">
          <div className="pointer-events-none absolute inset-0 bg-aurora-mesh opacity-60" />
          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
            <span className="text-sm font-semibold text-white">Menu</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Chiudi menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="relative flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {NAV.map((entry) => {
                if (!isGroup(entry)) {
                  const Icon = entry.icon;
                  const active = pathname === entry.href;
                  return (
                    <li key={entry.href}>
                      <Link
                        href={entry.href}
                        className={clsx(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                          active
                            ? "bg-premium-gradient-soft text-white shadow-inner-glow ring-1 ring-inset ring-white/10"
                            : "text-white/70 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Icon className={clsx("h-4 w-4 shrink-0", active && "text-accent-600")} />
                        {entry.label}
                      </Link>
                    </li>
                  );
                }

                const Icon = entry.icon;
                const groupActive = pathname.startsWith(entry.basePath);
                const isOpen = openGroup === entry.label || groupActive;

                return (
                  <li key={entry.label}>
                    <button
                      type="button"
                      onClick={() => setOpenGroup(openGroup === entry.label ? null : entry.label)}
                      className={clsx(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                        groupActive ? "bg-white/5 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon className={clsx("h-4 w-4 shrink-0", groupActive && "text-accent-600")} />
                      <span className="flex-1 text-left">{entry.label}</span>
                      <ChevronDown
                        className={clsx(
                          "h-3.5 w-3.5 shrink-0 text-white/40 transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {isOpen && (
                      <ul className="mt-1 space-y-0.5 border-l-2 border-white/10 pl-4">
                        {entry.items.map((item) => {
                          const ItemIcon = item.icon;
                          const active = pathname === item.href;
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className={clsx(
                                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-150",
                                  active
                                    ? "bg-white/10 font-medium text-accent-700"
                                    : "text-white/55 hover:bg-white/5 hover:text-white"
                                )}
                              >
                                <ItemIcon className="h-3.5 w-3.5 shrink-0" />
                                {item.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
