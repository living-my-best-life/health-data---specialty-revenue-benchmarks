"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Bar,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface TrendData {
  year: number;
  providers: number;
  total_benes: number;
  total_payments: number;
}

interface Props {
  data: TrendData[];
}

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
      <p style={{ fontSize: 13, fontWeight: 600, color: "#e8e8ed", marginBottom: 6 }}>
        {label}
      </p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
          {p.name}: {p.name === "Total Spending"
            ? formatCurrency(p.value)
            : formatNumber(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function EDTrendChart({ data }: Props) {
  const chartData = useMemo(
    () =>
      data
        .sort((a, b) => a.year - b.year)
        .map((d) => ({
          year: d.year,
          "Total Spending": d.total_payments,
          "Beneficiaries": d.total_benes,
          "Providers": d.providers,
          costPerBene: d.total_benes > 0 ? d.total_payments / d.total_benes : 0,
        })),
    [data]
  );

  const growthRate = useMemo(() => {
    if (chartData.length < 2) return 0;
    const first = chartData[0]["Total Spending"];
    const last = chartData[chartData.length - 1]["Total Spending"];
    if (first <= 0) return 0;
    return ((last / first - 1) * 100);
  }, [chartData]);

  return (
    <div
      style={{
        background: "#12121a",
        border: "1px solid #1e1e2e",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e8e8ed", marginBottom: 4 }}>
            ED Spending Trend
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            Medicare Emergency Medicine total payments, 2018–2023
          </p>
        </div>
        <div
          style={{
            padding: "6px 12px",
            background: growthRate > 0 ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
            borderRadius: 6,
            border: `1px solid ${growthRate > 0 ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: growthRate > 0 ? "#fca5a5" : "#86efac",
            }}
          >
            {growthRate > 0 ? "+" : ""}
            {growthRate.toFixed(1)}%
          </span>
          <span style={{ fontSize: 10, color: "#8888a0", marginLeft: 4 }}>
            since 2018
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={{ stroke: "#1e1e2e" }}
            tickLine={false}
          />
          <YAxis
            yAxisId="spending"
            tickFormatter={(v) => `$${(v / 1_000_000_000).toFixed(1)}B`}
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="benes"
            orientation="right"
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            yAxisId="spending"
            type="monotone"
            dataKey="Total Spending"
            stroke="#ef4444"
            fill="url(#spendingGradient)"
            strokeWidth={2}
          />
          <Line
            yAxisId="benes"
            type="monotone"
            dataKey="Beneficiaries"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ fill: "#6366f1", r: 4 }}
          />
          <defs>
            <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
