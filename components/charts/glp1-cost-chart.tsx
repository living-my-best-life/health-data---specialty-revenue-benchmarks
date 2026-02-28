"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface SpendingData {
  brnd_name: string;
  tot_spndng: number;
  tot_benes: number;
  period_start: string;
  period_end: string;
}

interface Props {
  data: SpendingData[];
}

const BRAND_COLORS: Record<string, string> = {
  Ozempic: "#6366f1",
  Mounjaro: "#22c55e",
  Rybelsus: "#06b6d4",
  Wegovy: "#a855f7",
  Zepbound: "#f97316",
};

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        background: "#1a1a28",
        border: "1px solid #2a2a3e",
        borderRadius: 8,
        padding: "12px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 600, color: "#e8e8ed", marginBottom: 6 }}>
        {d.brand}
      </p>
      <p style={{ fontSize: 12, color: "#a5b4fc" }}>
        Cost/Beneficiary: {formatCurrency(d.costPerBene)}
      </p>
      <p style={{ fontSize: 12, color: "#22c55e" }}>
        Total Spending: {formatCurrency(d.spending)}
      </p>
      <p style={{ fontSize: 11, color: "#8888a0", marginTop: 4 }}>
        {formatNumber(d.benes)} beneficiaries
      </p>
    </div>
  );
}

export default function GLP1CostChart({ data }: Props) {
  const chartData = useMemo(() => {
    const brands = [...new Set(data.map((d) => d.brnd_name))];
    return brands
      .map((brand) => {
        const annual = data.find(
          (d) =>
            d.brnd_name === brand &&
            d.period_start === "2024-01-01" &&
            d.period_end === "2024-12-31"
        );
        if (!annual || annual.tot_benes === 0) return null;
        return {
          brand,
          costPerBene: annual.tot_spndng / annual.tot_benes,
          spending: annual.tot_spndng,
          benes: annual.tot_benes,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.costPerBene - a.costPerBene) as {
      brand: string;
      costPerBene: number;
      spending: number;
      benes: number;
    }[];
  }, [data]);

  return (
    <div
      style={{
        background: "#12121a",
        border: "1px solid #1e1e2e",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e8e8ed", marginBottom: 4 }}>
        Cost per Beneficiary
      </h3>
      <p style={{ fontSize: 12, color: "#8888a0", marginBottom: 24 }}>
        Annual Medicare spending per beneficiary by brand, 2024
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 0, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis
            dataKey="brand"
            tick={{ fill: "#c0c0d0", fontSize: 12 }}
            axisLine={{ stroke: "#1e1e2e" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v)}
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Bar dataKey="costPerBene" radius={[6, 6, 0, 0]} barSize={48}>
            {chartData.map((d) => (
              <Cell key={d.brand} fill={BRAND_COLORS[d.brand] || "#8888a0"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
