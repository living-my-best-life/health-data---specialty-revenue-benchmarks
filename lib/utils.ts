export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

export function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function shortenSpecialty(name: string): string {
  const map: Record<string, string> = {
    "Emergency Medicine": "Emergency Med",
    "Family Practice": "Family Practice",
    "Internal Medicine": "Internal Med",
    "Orthopedic Surgery": "Orthopedics",
    "Dermatology": "Dermatology",
    "Psychiatry": "Psychiatry",
    "Psychologist, Clinical": "Psychology",
    "Nurse Practitioner": "Nurse Pract.",
    "Physician Assistant": "Physician Asst.",
  };
  return map[name] || name;
}

export const SPECIALTY_COLORS: Record<string, string> = {
  "Emergency Medicine": "#ef4444",
  "Family Practice": "#6366f1",
  "Internal Medicine": "#8b5cf6",
  "Orthopedic Surgery": "#06b6d4",
  "Dermatology": "#22c55e",
  "Psychiatry": "#a855f7",
  "Psychologist, Clinical": "#f97316",
  "Nurse Practitioner": "#14b8a6",
  "Physician Assistant": "#eab308",
};

export const CHART_COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#06b6d4", "#14b8a6",
  "#22c55e", "#eab308", "#f97316", "#ef4444",
];
