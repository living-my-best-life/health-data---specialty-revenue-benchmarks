"use client";

import DashboardHeader from "@/components/dashboard-header";
import MetricCard from "@/components/metric-card";
import SpecialtyBarChart from "@/components/charts/specialty-bar-chart";
import MarketSizeChart from "@/components/charts/market-size-chart";
import ProviderVolumeChart from "@/components/charts/provider-volume-chart";
import ProcedureTable from "@/components/charts/procedure-table";
import StateHeatmap from "@/components/charts/state-heatmap";
import RevenueScatter from "@/components/charts/revenue-scatter";
import { formatCurrency, formatNumber } from "@/lib/utils";

import specialtySummary from "@/data/specialty-summary.json";
import topProcedures from "@/data/top-procedures.json";
import stateSpecialty from "@/data/state-specialty.json";

interface SpecialtySummary {
  specialty: string;
  provider_count: number;
  total_services: number;
  total_payments: number;
  total_medical_payments: number;
  total_drug_payments: number;
  avg_payment_per_provider: number;
  avg_benes_per_provider: number;
}

interface ProcedureData {
  specialty: string;
  hcpcs_cd: string;
  hcpcs_desc: string;
  total_services: number;
  total_beneficiaries: number;
  weighted_avg_payment: number;
  num_providers: number;
}

interface StateData {
  state: string;
  specialty: string;
  provider_count: number;
  total_payments: number;
  avg_payment: number;
}

const summary = specialtySummary as SpecialtySummary[];
const procedures = topProcedures as ProcedureData[];
const stateData = stateSpecialty as StateData[];

export default function SpecialtyBenchmarkPage() {
  const totalProviders = summary.reduce((s, d) => s + d.provider_count, 0);
  const totalPayments = summary.reduce((s, d) => s + d.total_payments, 0);
  const highestSpecialty = [...summary].sort(
    (a, b) => b.avg_payment_per_provider - a.avg_payment_per_provider
  )[0];
  const specialties = summary.map((d) => d.specialty).sort();

  return (
    <div style={{ maxWidth: 1200 }}>
      <DashboardHeader
        title="Specialty Revenue Benchmark"
        description="Compare Medicare Part B revenue, procedure volumes, and payment patterns across 9 key specialties relevant to urgent care and on-demand healthcare."
        badge="2023 Data"
      />

      {/* Metric Cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
        <MetricCard
          label="Total Providers Analyzed"
          value={formatNumber(totalProviders)}
          subtext="Across 9 specialties"
        />
        <MetricCard
          label="Total Medicare Payments"
          value={formatCurrency(totalPayments)}
          subtext="Part B fee-for-service, 2023"
          accentColor="#22c55e"
        />
        <MetricCard
          label="Highest Avg Revenue"
          value={formatCurrency(highestSpecialty?.avg_payment_per_provider || 0)}
          subtext={highestSpecialty?.specialty || "—"}
          accentColor="#a855f7"
        />
        <MetricCard
          label="Data Year"
          value="2023"
          subtext="CMS Medicare Provider Utilization"
          accentColor="#06b6d4"
        />
      </div>

      {/* Row 1: Revenue bar + Market size */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <SpecialtyBarChart data={summary} />
        <MarketSizeChart data={summary} />
      </div>

      {/* Row 2: Provider volume + Scatter */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <ProviderVolumeChart data={summary} />
        <RevenueScatter data={summary} />
      </div>

      {/* Row 3: Full width table */}
      <div style={{ marginBottom: 20 }}>
        <ProcedureTable data={procedures} specialties={specialties} />
      </div>

      {/* Row 4: Full width heatmap */}
      <div style={{ marginBottom: 40 }}>
        <StateHeatmap data={stateData} specialties={specialties} />
      </div>
    </div>
  );
}
