"use client";

import { useMemo } from "react";
import DashboardHeader from "@/components/dashboard-header";
import MetricCard from "@/components/metric-card";
import DensityHeatmap from "@/components/charts/density-heatmap";
import DensityRankingChart from "@/components/charts/density-ranking-chart";
import ShortageMap from "@/components/charts/shortage-map";
import SpecialtyComparisonChart from "@/components/charts/specialty-comparison-chart";
import ProviderDensityTable from "@/components/charts/provider-density-table";
import { shortenSpecialty } from "@/lib/utils";

import providerDensityRaw from "@/data/provider-density.json";
import hpsaShortageRaw from "@/data/hpsa-shortage.json";

interface ProviderDensity {
  state: string;
  specialty: string;
  provider_count: number;
  total_benes: number;
  total_payments: number;
}

interface HPSAData {
  state: string;
  pc_shortage_areas: number;
  pc_total_shortage: number;
  mh_shortage_areas: number;
  mh_total_shortage: number;
}

const providerDensity = providerDensityRaw as ProviderDensity[];
const hpsaShortage = hpsaShortageRaw as HPSAData[];

export default function ProviderDensityPage() {
  const metrics = useMemo(() => {
    const states = [...new Set(providerDensity.map((d) => d.state))];

    // Core specialties for underserved analysis
    const coreSpecialties = [
      "Family Practice",
      "Internal Medicine",
      "Psychiatry",
      "Orthopedic Surgery",
      "Dermatology",
    ];

    // Average density per state across core specialties
    const stateDensities = states.map((state) => {
      const stateData = providerDensity.filter(
        (d) => d.state === state && coreSpecialties.includes(d.specialty)
      );
      const totalProviders = stateData.reduce((s, d) => s + d.provider_count, 0);
      const benes = stateData[0]?.total_benes || 1;
      return {
        state,
        density: (totalProviders / benes) * 10000,
      };
    });

    const sorted = [...stateDensities].sort((a, b) => a.density - b.density);
    const mostUnderserved = sorted[0];
    const highestDensity = sorted[sorted.length - 1];

    // Total HPSA shortage areas (primary care)
    const pcShortage = hpsaShortage
      .reduce((s, d) => s + d.pc_shortage_areas, 0);

    // Total providers across all specialties
    const totalProviders = providerDensity.reduce(
      (s, d) => s + d.provider_count,
      0
    );

    return {
      stateCount: states.length,
      mostUnderserved: mostUnderserved?.state || "—",
      mostUnderservedDensity: mostUnderserved?.density || 0,
      highestDensity: highestDensity?.state || "—",
      highestDensityVal: highestDensity?.density || 0,
      hpsaAreas: pcShortage,
      totalProviders,
    };
  }, []);

  return (
    <div className="dashboard-container">
      <DashboardHeader
        title="Provider Density & White Space"
        description="Map provider concentration by specialty across all 50 states + DC to identify underserved markets, HPSA shortage areas, and expansion opportunities."
        badge="CMS Medicare 2023 + HRSA HPSA"
      />

      {/* Metric Cards */}
      <div className="dashboard-metrics">
        <MetricCard
          label="States Analyzed"
          value={String(metrics.stateCount)}
          subtext="All US states + DC"
        />
        <MetricCard
          label="Most Underserved"
          value={metrics.mostUnderserved}
          subtext={`${metrics.mostUnderservedDensity.toFixed(1)} core providers per 10K benes`}
          accentColor="#ef4444"
        />
        <MetricCard
          label="HPSA Shortage Areas"
          value={metrics.hpsaAreas.toLocaleString()}
          subtext="Designated primary care HPSAs"
          accentColor="#f97316"
        />
        <MetricCard
          label="Highest Density"
          value={metrics.highestDensity}
          subtext={`${metrics.highestDensityVal.toFixed(1)} core providers per 10K benes`}
          accentColor="#22c55e"
        />
      </div>

      {/* Row 1: Density heatmap (full width) */}
      <div className="dashboard-section">
        <DensityHeatmap data={providerDensity} />
      </div>

      {/* Row 2: Ranking + Specialty comparison */}
      <div className="dashboard-grid-2col">
        <DensityRankingChart data={providerDensity} />
        <SpecialtyComparisonChart data={providerDensity} />
      </div>

      {/* Row 3: HPSA Shortage map (full width) */}
      <div className="dashboard-section">
        <ShortageMap data={hpsaShortage} />
      </div>

      {/* Row 4: Full reference table */}
      <div className="dashboard-section-last">
        <ProviderDensityTable
          densityData={providerDensity}
          hpsaData={hpsaShortage}
        />
      </div>
    </div>
  );
}
