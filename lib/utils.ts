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

export function formatExactCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export const PAYER_COLORS: Record<string, string> = {
  "UnitedHealthcare": "#6366f1",
  "Aetna": "#a855f7",
  "Cigna": "#06b6d4",
  "BCBS Minnesota": "#3b82f6",
  "BCBS Alabama": "#2563eb",
  "Blue Shield CA": "#0ea5e9",
  "Premera": "#14b8a6",
  "HealthPartners": "#22c55e",
  "UCare": "#eab308",
  "Healthcare Bluebook": "#f97316",
};

export const PAYER_SHORT: Record<string, string> = {
  "UnitedHealthcare": "UHC",
  "Aetna": "Aetna",
  "Cigna": "Cigna",
  "BCBS Minnesota": "BCBS MN",
  "BCBS Alabama": "BCBS AL",
  "Blue Shield CA": "BSCA",
  "Premera": "Premera",
  "HealthPartners": "HP",
  "UCare": "UCare",
  "Healthcare Bluebook": "Bluebook",
};

export const CPT_METADATA: Record<string, { name: string; specialty: string; shortName: string }> = {
  "99213": { name: "Office Visit - Established, Low MDM", specialty: "Urgent Care / E&M", shortName: "OV Low" },
  "99214": { name: "Office Visit - Established, Moderate MDM", specialty: "Urgent Care / E&M", shortName: "OV Moderate" },
  "99215": { name: "Office Visit - Established, High MDM", specialty: "Urgent Care / E&M", shortName: "OV High" },
  "20610": { name: "Joint Injection - Major Joint", specialty: "Orthopedics", shortName: "Joint Inj" },
  "27447": { name: "Total Knee Replacement", specialty: "Orthopedics", shortName: "TKR" },
  "17003": { name: "Lesion Destruction (each add'l)", specialty: "Dermatology", shortName: "Lesion +1" },
  "11102": { name: "Tangential Skin Biopsy", specialty: "Dermatology", shortName: "Skin Bx" },
  "90837": { name: "Psychotherapy 60 min", specialty: "Behavioral Health", shortName: "Psych 60" },
  "90834": { name: "Psychotherapy 45 min", specialty: "Behavioral Health", shortName: "Psych 45" },
};
