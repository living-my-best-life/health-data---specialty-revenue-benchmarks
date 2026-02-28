import DashboardHeader from "@/components/dashboard-header";
import CostComparisonChart from "@/components/charts/cost-comparison-chart";
import AvoidableVisitsChart from "@/components/charts/avoidable-visits-chart";
import SpecialtyCostChart from "@/components/charts/specialty-cost-chart";
import EDStateHeatmap from "@/components/charts/ed-state-heatmap";
import EDTrendChart from "@/components/charts/ed-trend-chart";

import edVsUcData from "@/data/ed-vs-uc.json";
import edStateCosts from "@/data/ed-state-costs.json";
import edTrends from "@/data/ed-trends.json";

const SPECIALTY_COSTS = [
  { specialty: "Internal Medicine", providers: 92204, total_benes: 23247877, total_payments: 7564497493, cost_per_bene: 325 },
  { specialty: "Family Practice", providers: 83136, total_benes: 17200471, total_payments: 4897840583, cost_per_bene: 285 },
  { specialty: "Nurse Practitioner", providers: 189509, total_benes: 27371332, total_payments: 7489201634, cost_per_bene: 274 },
  { specialty: "Physician Assistant", providers: 105478, total_benes: 17002136, total_payments: 2903508586, cost_per_bene: 171 },
  { specialty: "Emergency Medicine", providers: 48541, total_benes: 14034485, total_payments: 2026504178, cost_per_bene: 144 },
];

function MetricCard({
  label,
  value,
  sub,
  accent = "#6366f1",
}: {
  label: string;
  value: string;
  sub: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: "#12121a",
        border: "1px solid #1e1e2e",
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        minWidth: 200,
      }}
    >
      <p style={{ fontSize: 12, color: "#8888a0", marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color: accent }}>{value}</p>
      <p style={{ fontSize: 11, color: "#555568", marginTop: 4 }}>{sub}</p>
    </div>
  );
}

export default function EDvsUrgentCarePage() {
  return (
    <div style={{ maxWidth: 1200 }}>
      <DashboardHeader
        title="ED vs Urgent Care Value Story"
        description="Why patients and payers should choose urgent care over the ED for non-emergent conditions — backed by CMS Medicare data."
        badge="Dashboard #5"
      />

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <MetricCard
          label="Avg ED Visit Cost"
          value="$1,228"
          sub="vs ~$150 for urgent care (MEPS 2023)"
          accent="#ef4444"
        />
        <MetricCard
          label="Avoidable ED Visits"
          value="27%"
          sub="Non-emergent + preventable (NYU Algorithm)"
          accent="#22c55e"
        />
        <MetricCard
          label="ED Cost Premium"
          value="2.2x"
          sub="ED high MDM vs office moderate visit"
          accent="#f97316"
        />
        <MetricCard
          label="Potential Annual Savings"
          value="$29B"
          sub="If avoidable visits diverted to UC"
          accent="#6366f1"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <CostComparisonChart data={edVsUcData} />
        <AvoidableVisitsChart />
      </div>

      <div style={{ marginBottom: 20 }}>
        <SpecialtyCostChart data={SPECIALTY_COSTS} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <EDStateHeatmap data={edStateCosts} />
        <EDTrendChart data={edTrends} />
      </div>
    </div>
  );
}
