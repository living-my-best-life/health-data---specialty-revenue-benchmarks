"use client";

import { useMemo } from "react";
import DashboardHeader from "@/components/dashboard-header";
import MetricCard from "@/components/metric-card";
import PayerComparisonChart from "@/components/charts/payer-comparison-chart";
import MedicareIndexChart from "@/components/charts/medicare-index-chart";
import RateRangeChart from "@/components/charts/rate-range-chart";
import RateSpreadHeatmap from "@/components/charts/rate-spread-heatmap";
import PayerRankingChart from "@/components/charts/payer-ranking-chart";
import PayerRateTable from "@/components/charts/payer-rate-table";
import { PAYER_SHORT } from "@/lib/utils";

import payerRatesRaw from "@/data/payer-rates.json";
import medicareFeeRaw from "@/data/medicare-fee-schedule.json";

interface PayerRate {
  billing_code: string;
  payer: string;
  median_rate: number;
  p25_rate: number;
  p75_rate: number;
  avg_rate: number;
  min_rate: number;
  max_rate: number;
  sample_size: number;
}

interface MedicareFee {
  hcpcs_code: string;
  non_facility_rate: number;
  facility_rate: number;
}

const payerRates = payerRatesRaw as PayerRate[];
const medicareFees = medicareFeeRaw as MedicareFee[];

export default function PayerRatesPage() {
  const metrics = useMemo(() => {
    const payers = [...new Set(payerRates.map((d) => d.payer))];
    const emCodes = ["99213", "99214", "99215"];
    const medicareMap = new Map<string, number>();
    medicareFees.forEach((m) => medicareMap.set(m.hcpcs_code, m.non_facility_rate));

    // Best/worst payer for E&M codes
    const payerEmAvg = payers.map((p) => {
      const rates = emCodes
        .map((c) => payerRates.find((d) => d.payer === p && d.billing_code === c)?.median_rate || 0)
        .filter((r) => r > 0);
      return {
        payer: p,
        avg: rates.length > 0 ? rates.reduce((s, v) => s + v, 0) / rates.length : 0,
      };
    }).filter((p) => p.avg > 0);

    const best = payerEmAvg.sort((a, b) => b.avg - a.avg)[0];
    const worst = payerEmAvg.sort((a, b) => a.avg - b.avg)[0];

    // Average commercial vs Medicare across all codes
    const allIndices: number[] = [];
    payerRates.forEach((d) => {
      const mcr = medicareMap.get(d.billing_code);
      if (mcr && mcr > 0 && d.median_rate > 0) {
        allIndices.push((d.median_rate / mcr) * 100);
      }
    });
    const avgIndex = allIndices.length > 0 ? allIndices.reduce((s, v) => s + v, 0) / allIndices.length : 100;

    return {
      payerCount: payers.length,
      bestPayer: best?.payer || "—",
      bestAvg: best?.avg || 0,
      worstPayer: worst?.payer || "—",
      worstAvg: worst?.avg || 0,
      avgVsMedicare: avgIndex - 100,
    };
  }, []);

  return (
    <div style={{ maxWidth: 1200 }}>
      <DashboardHeader
        title="Payer Rate Comparison"
        description="Compare in-network negotiated rates from 10 major payers against Medicare fee schedules for common urgent care, orthopedic, dermatology, and behavioral health procedures."
        badge="2024–2025 Transparency Data"
      />

      {/* Metric Cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
        <MetricCard
          label="Payers Analyzed"
          value={String(metrics.payerCount)}
          subtext="Commercial + Regional"
        />
        <MetricCard
          label="Best Payer (E&M Avg)"
          value={PAYER_SHORT[metrics.bestPayer] || metrics.bestPayer}
          subtext={`$${metrics.bestAvg.toFixed(0)} avg across office visits`}
          accentColor="#22c55e"
        />
        <MetricCard
          label="Worst Payer (E&M Avg)"
          value={PAYER_SHORT[metrics.worstPayer] || metrics.worstPayer}
          subtext={`$${metrics.worstAvg.toFixed(0)} avg across office visits`}
          accentColor="#ef4444"
        />
        <MetricCard
          label="Avg Commercial vs Medicare"
          value={`${metrics.avgVsMedicare >= 0 ? "+" : ""}${metrics.avgVsMedicare.toFixed(0)}%`}
          subtext="Median negotiated rate vs fee schedule"
          accentColor="#06b6d4"
        />
      </div>

      {/* Row 1: Hero comparison chart (full width) */}
      <div style={{ marginBottom: 20 }}>
        <PayerComparisonChart data={payerRates} medicare={medicareFees} />
      </div>

      {/* Row 2: Medicare index + Rate range */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <MedicareIndexChart data={payerRates} medicare={medicareFees} />
        <RateRangeChart data={payerRates} medicare={medicareFees} />
      </div>

      {/* Row 3: Heatmap (full width) */}
      <div style={{ marginBottom: 20 }}>
        <RateSpreadHeatmap data={payerRates} medicare={medicareFees} />
      </div>

      {/* Row 4: Payer ranking (full width) */}
      <div style={{ marginBottom: 20 }}>
        <PayerRankingChart data={payerRates} medicare={medicareFees} />
      </div>

      {/* Row 5: Detail table (full width) */}
      <div style={{ marginBottom: 40 }}>
        <PayerRateTable data={payerRates} medicare={medicareFees} />
      </div>
    </div>
  );
}
