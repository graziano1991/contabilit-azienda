"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  X,
} from "lucide-react";
import clsx from "clsx";

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

export function Sidebar({
  companyName,
  mobileOpen = false,
  onClose,
}: {
  companyName: string;
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const entry of NAV) {
      if (isGroup(entry)) {
        initial[entry.label] = pathname.startsWith(entry.basePath);
      }
    }
    return initial;
  });

  return (
    <>
      {/* Sfondo scuro dietro il cassetto su mobile: cliccandolo si chiude.
          Invisibile e non cliccabile da tablet in su, dove la sidebar è
          sempre visibile in linea col contenuto. bg-black fisso invece di
          un token neutral: qui serve sempre e solo uno scrim scuro,
          indipendentemente da come cambia la palette in futuro. */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={clsx(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[85vw] shrink-0 flex-col overflow-hidden bg-[#07050f] transition-transform duration-300 ease-snappy",
          "md:static md:z-auto md:w-64 md:max-w-none md:translate-x-0",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        {/* Aurora interna della sidebar: le stesse tonalità viola/fucsia/
            ciano dello sfondo globale, ma contenute qui dentro così la
            sidebar resta leggibile come pannello a sé, coerente col resto. */}
        <div className="pointer-events-none absolute inset-0 bg-aurora-mesh opacity-70" />
        <div className="pointer-events-none absolute -left-16 top-20 h-56 w-56 animate-blob rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-24 h-64 w-64 animate-blob rounded-full bg-accent-500/15 blur-3xl [animation-delay:4s]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        <div className="relative flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
          <div className="rounded-lg shadow-glow">
            <Image
              src="/logo.png"
              alt="FinanzaCore"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-lg"
              priority
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight text-white">
              FinanzaCore
            </p>
            <p className="truncate text-xs leading-tight text-white/50">
              {companyName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white active:scale-95 md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="relative flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV.map((entry) => {
              if (!isGroup(entry)) {
                const Icon = entry.icon;
                const active = pathname === entry.href;
                return (
                  <li key={entry.href}>
                    <Link
                      href={entry.href}
                      onClick={onClose}
                      className={clsx(
                        "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                        active
                          ? "bg-premium-gradient-soft text-white shadow-inner-glow ring-1 ring-inset ring-white/10"
                          : "text-white/60 hover:translate-x-0.5 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {active && (
                        <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-premium-gradient shadow-glow" />
                      )}
                      <Icon
                        className={clsx(
                          "h-4 w-4 shrink-0",
                          active && "text-accent-600"
                        )}
                      />
                      {entry.label}
                    </Link>
                  </li>
                );
              }

              const Icon = entry.icon;
              const groupActive = pathname.startsWith(entry.basePath);
              const isOpen = openGroups[entry.label] ?? groupActive;

              return (
                <li key={entry.label}>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroups((prev) => ({
                        ...prev,
                        [entry.label]: !isOpen,
                      }))
                    }
                    className={clsx(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                      groupActive
                        ? "bg-white/5 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon
                      className={clsx(
                        "h-4 w-4 shrink-0",
                        groupActive && "text-accent-600"
                      )}
                    />
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
                              onClick={onClose}
                              className={clsx(
                                "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-all duration-150",
                                active
                                  ? "bg-white/10 font-medium text-accent-700"
                                  : "text-white/50 hover:translate-x-0.5 hover:bg-white/5 hover:text-white"
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
      </aside>
    </>
  );
}
