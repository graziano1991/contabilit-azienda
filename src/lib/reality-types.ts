import { Home, Building, Hotel, type LucideIcon } from "lucide-react";

export type RealityType = "affitto_breve" | "appartamento" | "hotel";

export const REALITY_TYPE_LABEL: Record<RealityType, string> = {
  affitto_breve: "Affitto Breve",
  appartamento: "Appartamento",
  hotel: "Hotel / Struttura",
};

export const REALITY_TYPE_ICON: Record<RealityType, LucideIcon> = {
  affitto_breve: Home,
  appartamento: Building,
  hotel: Hotel,
};

export const REALITY_TYPE_PATH: Record<RealityType, string> = {
  affitto_breve: "affitti-brevi",
  appartamento: "appartamenti",
  hotel: "hotel",
};

export const STATUS_LABEL: Record<string, string> = {
  attiva: "Attiva",
  inattiva: "Inattiva",
  in_ristrutturazione: "In ristrutturazione",
  chiusa: "Chiusa",
};
