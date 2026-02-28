"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface SpendingData {
  brnd_name: string;
  tot_spndng: number;
  tot_clms: number;
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

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
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
      <p style={{ fontSize: 13, fontWeight: 600, color: "#e8e8ed", marginBottom: 8 }}>
        {label}
      </p>
      {payload
        .filter((p: any) => p.value > 0)
        .sort((a: any, b: any) => b.value - a.value)
        .map((p: any) => (
          <div
            key={p.name}
            style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 3 }}
          >
            <span style={{ fontSize: 11, color: p.color }}>{p.name}</span>
            <span style={{ fontSize: 11, color: "#c0c0d0", fontWeight: 600 }}>
              {formatCurrency(p.value)}
            </span>
          </div>
        ))}
    </div>
  );
}

const PERIODS: { start: string; end: string; label: string }[] = [
  { start: "2024-01-01", end: "2024-12-31", label: "2024 Full Year" },
  { start: "2025-01-01", end: "2025-06-30", label: "2025 H1" },
];

export default function GLP1SpendingChart({ data }: Props) {
  const brands = [...new Set(data.map((d) => d.brnd_name))];

  const chartData = PERIODS.map((p) => {
    const row: any = { period: p.label };
    brands.forEach((b) => {
      const entry = data.find(
        (d) => d.brnd_name === b && d.period_start === p.start && d.period_end === p.end
      );
      row[b] = entry ? entry.tot_spndng : 0;
    });
    return row;
  });

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
        GLP-1 Medicare Spending Explosion
      </h3>
      <p style={{ fontSize: 12, color: "#8888a0", marginBottom: 24 }}>
        Total Medicare Part D spending by brand — 2024 vs 2025 trajectory
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis
            dataKey="period"
            tick={{ fill: "#8888a0", fontSize: 10 }}
            axisLine={{ stroke: "#1e1e2e" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v)}
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="square" />
          {brands.map((b) => (
            <Bar
              key={b}
              dataKey={b}
              fill={BRAND_COLORS[b] || "#8888a0"}
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
