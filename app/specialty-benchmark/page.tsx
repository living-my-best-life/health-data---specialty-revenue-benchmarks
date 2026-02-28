"use client";

import { useMemo } from "react";
import DashboardHeader from "@/components/dashboard-header";
import MetricCard from "@/components/metric-card";
import SpecialtyBarChart from "@/components/charts/specialty-bar-chart";
import MarketSizeChart from "@/components/charts/market-size-chart";
import ProviderVolumeChart from "@/components/charts/provider-volume-chart";
import ProcedureTable from "@/components/charts/procedure-table";
import StateHeatmap from "@/components/charts/state-heatmap";
import RevenueScatter from "@/components/charts/revenue-scatter";
import TrendLineChart from "@/components/charts/trend-line-chart";
import { formatCurrency, formatNumber } from "@/lib/utils";

import specialtySummary from "@/data/specialty-summary.json";
import topProcedures from "@/data/top-procedures.json";
import stateSpecialty from "@/data/state-specialty.json";
import specialtyTrends from "@/data/specialty-trends.json";

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

interface TrendData {
  year: number;
  specialty: string;
  provider_count: number;
  total_payments: number;
  avg_payment_per_provider: number;
  avg_benes: number;
}

const summary = specialtySummary as SpecialtySummary[];
const procedures = topProcedures as ProcedureData[];
const stateData = stateSpecialty as StateData[];
const trends = specialtyTrends as TrendData[];

export default function SpecialtyBenchmarkPage() {
  const totalProviders = summary.reduce((s, d) => s + d.provider_count, 0);
  const totalPayments = summary.reduce((s, d) => s + d.total_payments, 0);
  const highestSpecialty = [...summary].sort(
    (a, b) => b.avg_payment_per_provider - a.avg_payment_per_provider
  )[0];
  const specialties = summary.map((d) => d.specialty).sort();

  const fastestGrowing = useMemo(() => {
    const growth: { specialty: string; cagr: number }[] = [];
    const specs = [...new Set(trends.map((t) => t.specialty))];
    specs.forEach((s) => {
      const rows = trends.filter((t) => t.specialty === s).sort((a, b) => a.year - b.year);
      if (rows.length >= 2) {
        const first = rows[0];
        const last = rows[rows.length - 1];
        const years = last.year - first.year;
        if (first.avg_payment_per_provider > 0 && years > 0) {
          const cagr =
            (Math.pow(last.avg_payment_per_provider / first.avg_payment_per_provider, 1 / years) -
              1) *
            100;
          growth.push({ specialty: s, cagr });
        }
      }
    });
    return growth.sort((a, b) => b.cagr - a.cagr)[0];
  }, []);

  return (
    <div className="dashboard-container">
      <DashboardHeader
        title="Specialty Revenue Benchmark"
        description="Compare Medicare Part B revenue, procedure volumes, and payment patterns across 9 key specialties relevant to urgent care and on-demand healthcare."
        badge="2013-2023 Data"
      />

      {/* Metric Cards */}
      <div className="dashboard-metrics">
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
          subtext={highestSpecialty?.specialty || "---"}
          accentColor="#a855f7"
        />
        <MetricCard
          label="Fastest Growing (CAGR)"
          value={fastestGrowing ? `+${fastestGrowing.cagr.toFixed(1)}%` : "---"}
          subtext={fastestGrowing?.specialty || "---"}
          accentColor="#06b6d4"
        />
      </div>

      {/* Row 1: Trend chart (full width) */}
      <div className="dashboard-section">
        <TrendLineChart data={trends} />
      </div>

      {/* Row 2: Revenue bar + Market size */}
      <div className="dashboard-grid-2col">
        <SpecialtyBarChart data={summary} />
        <MarketSizeChart data={summary} />
      </div>

      {/* Row 3: Provider volume + Scatter */}
      <div className="dashboard-grid-2col">
        <ProviderVolumeChart data={summary} />
        <RevenueScatter data={summary} />
      </div>

      {/* Row 4: Full width table */}
      <div className="dashboard-section">
        <ProcedureTable data={procedures} specialties={specialties} />
      </div>

      {/* Row 5: Full width heatmap */}
      <div className="dashboard-section-last">
        <StateHeatmap data={stateData} specialties={specialties} />
      </div>
    </div>
  );
}
