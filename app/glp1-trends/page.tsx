"use client";

import { useMemo } from "react";
import DashboardHeader from "@/components/dashboard-header";
import MetricCard from "@/components/metric-card";
import GLP1SpendingChart from "@/components/charts/glp1-spending-chart";
import GLP1ClaimsChart from "@/components/charts/glp1-claims-chart";
import GLP1PrescriberChart from "@/components/charts/glp1-prescriber-chart";
import GLP1BrandTable from "@/components/charts/glp1-brand-table";
import GLP1GeoHeatmap from "@/components/charts/glp1-geo-heatmap";
import GLP1CostChart from "@/components/charts/glp1-cost-chart";
import { formatCurrency, formatNumber } from "@/lib/utils";

import quarterlySpending from "@/data/glp1-quarterly-spending.json";
import prescriberSpecialty from "@/data/glp1-prescriber-specialty.json";
import statePrescribing from "@/data/glp1-state-prescribing.json";

interface SpendingData {
  brnd_name: string;
  gnrc_name: string;
  tot_spndng: number;
  tot_clms: number;
  tot_benes: number;
  period_start: string;
  period_end: string;
}

interface PrescriberData {
  specialty: string;
  brand_group: string;
  total_claims: number;
  total_cost: number;
  num_prescribers: number;
}

interface StateData {
  state: string;
  generic_name: string;
  total_claims: number;
  total_cost: number;
  total_benes: number;
}

const spending = quarterlySpending as SpendingData[];
const prescribers = prescriberSpecialty as PrescriberData[];
const stateData = statePrescribing as StateData[];

export default function GLP1TrendsPage() {
  const metrics = useMemo(() => {
    // H1 2025 total spending annualized
    const h1Data = spending.filter(
      (d) => d.period_start === "2025-01-01" && d.period_end === "2025-06-30"
    );
    const h1Total = h1Data.reduce((s, d) => s + d.tot_spndng, 0);
    const annualized2025 = h1Total * 2;

    // Total beneficiaries (H1 2025)
    const totalBenes = h1Data.reduce((s, d) => s + d.tot_benes, 0);

    // Fastest growing brand (2024 annual vs 2025 H1 annualized)
    const brands = [...new Set(spending.map((d) => d.brnd_name))];
    let fastestBrand = "";
    let fastestGrowth = -Infinity;
    brands.forEach((b) => {
      const annual2024 = spending.find(
        (d) => d.brnd_name === b && d.period_start === "2024-01-01" && d.period_end === "2024-12-31"
      );
      const h1_2025 = spending.find(
        (d) => d.brnd_name === b && d.period_start === "2025-01-01" && d.period_end === "2025-06-30"
      );
      if (annual2024 && h1_2025 && annual2024.tot_spndng > 0) {
        const growth =
          ((h1_2025.tot_spndng * 2 - annual2024.tot_spndng) / annual2024.tot_spndng) * 100;
        if (growth > fastestGrowth) {
          fastestGrowth = growth;
          fastestBrand = b;
        }
      }
    });

    // Top prescribing specialty (Semaglutide)
    const topSpec = [...prescribers]
      .filter((d) => d.brand_group === "Semaglutide")
      .sort((a, b) => b.total_claims - a.total_claims)[0];

    return { annualized2025, totalBenes, fastestBrand, fastestGrowth, topSpec };
  }, []);

  return (
    <div className="dashboard-container">
      <DashboardHeader
        title="GLP-1 Prescribing Trends"
        description="Track the explosive growth of semaglutide (Ozempic/Wegovy) and tirzepatide (Mounjaro/Zepbound) across Medicare Part D — spending, claims, prescribers, and geography."
        badge="Data through H1 2025"
      />

      {/* Metric Cards */}
      <div className="dashboard-metrics">
        <MetricCard
          label="GLP-1 Spending (2025 Ann.)"
          value={formatCurrency(metrics.annualized2025)}
          subtext="H1 2025 annualized rate"
        />
        <MetricCard
          label="Total Beneficiaries"
          value={formatNumber(metrics.totalBenes)}
          subtext="On GLP-1s, H1 2025"
          accentColor="#22c55e"
        />
        <MetricCard
          label="Fastest Growing Brand"
          value={`+${metrics.fastestGrowth.toFixed(0)}%`}
          subtext={metrics.fastestBrand}
          accentColor="#f97316"
        />
        <MetricCard
          label="Top Prescribing Specialty"
          value={formatNumber(metrics.topSpec?.total_claims || 0)}
          subtext={metrics.topSpec?.specialty || "---"}
          accentColor="#a855f7"
        />
      </div>

      {/* Row 1: Spending + Claims side by side */}
      <div className="dashboard-grid-2col">
        <GLP1SpendingChart data={spending} />
        <GLP1ClaimsChart data={spending} />
      </div>

      {/* Row 2: Brand table (full width) */}
      <div className="dashboard-section">
        <GLP1BrandTable data={spending} />
      </div>

      {/* Row 3: Prescriber + Cost side by side */}
      <div className="dashboard-grid-2col">
        <GLP1PrescriberChart data={prescribers} />
        <GLP1CostChart data={spending} />
      </div>

      {/* Row 4: Geographic heatmap (full width) */}
      <div className="dashboard-section-last">
        <GLP1GeoHeatmap data={stateData} />
      </div>
    </div>
  );
}
